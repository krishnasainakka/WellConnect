import {
  getClientId,
  addClient,
  removeClient,
  getClient,
  setClientCoach,
  markInitialMessageSent,
  setClientVoiceConfig,
} from '../utils/clientManager.js'; // Use named imports for destructured require

import { initializeTranscriber } from '../services/assemblyService.js';
import { initializeChat, streamGeminiResponse } from '../services/geminiService.js';
import { sendTTSRequest, clearPreviousContext } from '../services/murfService.js';
import { saveSessionAndGenerateReport } from '../services/reportGenerationService.js';

function websocketHandler(ws) {
  console.log('📞 New WS connection received');

  const clientId = getClientId();
  console.log('🔗 Client connected:', clientId);

  let transcriber = null;

  addClient(clientId, { 
    userId: null,
    ws, 
    transcriber, 
    chat: null,
    conversationHistory: [], // Track conversation for report
    sessionStartTime: null  // Track session start time
  });

  ws.on('message', async (message) => {
    const messageStr = message.toString('utf8');
    // console.log('📩 Received message from client:', messageStr);

    try {
      if (messageStr.startsWith('{')) {
        const data = JSON.parse(messageStr);
        console.log('🧠 Parsed client message:', data);

        if (data.type === 'selectCoach' && data.coach) {
          if (data.userId) {
            const clientData = getClient(clientId);
            clientData.userId = data.userId;
          }
          console.log('🎯 Coach selected:', data.coach.name);
          
          // Set voice config directly from coach
          if (data.coach.voiceSettings) {
            console.log('🎙️ Voice settings from coach applied:', data.coach.voiceSettings);
            setClientVoiceConfig(clientId, data.coach.voiceSettings);
          }

          await setupCoachAndChat(data.coach);
        } else if (data.type === 'startSession') {
          console.log('🚀 Session start requested');
          
          // Handle voice configuration
          if (data.voiceConfig) {
            console.log('🎵 Voice config received:', data.voiceConfig);
            setClientVoiceConfig(clientId, data.voiceConfig);
          }

          if (data.coachType) {
            getClient(clientId).coachType = data.coachType; 
          }
          
          // Record session start time
          const clientData = getClient(clientId);
          clientData.sessionStartTime = new Date();
          clientData.conversationHistory = []; // Reset conversation history
          
          await sendInitialMessage();
        } else if (data.type === 'endSession') {
          console.log('🛑 Session end requested');
          await handleEndSession();
        } else if (data.type === 'updateVoiceConfig' && data.voiceConfig) {
          console.log('🎵 Voice config updated:', data.voiceConfig);
          setClientVoiceConfig(clientId, data.voiceConfig);
        }
      } else if (transcriber) {
        transcriber.sendAudio(message);
      }
    } catch (error) {
      console.error('⚠️ Error handling message:', error.message);
      if (transcriber) transcriber.sendAudio(message);
    }
  });

  initializeTranscriber()
    .then((createdTranscriber) => {
      transcriber = createdTranscriber;
      getClient(clientId).transcriber = transcriber;

      transcriber.on('turn', async (turn) => {
        const clientData = getClient(clientId);
        const chat = clientData.chat;
        const text = turn.transcript?.trim();

        if (turn.end_of_turn && text && text !== clientData.lastFinalTranscript) {
          if (!chat) {
            ws.send(JSON.stringify({ error: 'Please select a coach first before starting conversation.' }));
            return;
          }

          clientData.lastFinalTranscript = text;
          ws.send(JSON.stringify({ user: text }));

          // Add user message to conversation history
          clientData.conversationHistory.push({
            speaker: 'user',
            text: text,
            timestamp: new Date()
          });

          try {
            let reply = '';
            for await (const chunk of streamGeminiResponse(chat, text)) {
              if (chunk) {
                ws.send(JSON.stringify({ geminiChunk: chunk }));
                reply += chunk;
              }
            }
            ws.send(JSON.stringify({ geminiDone: true }));

            // Add AI response to conversation history
            if (reply.trim()) {
              clientData.conversationHistory.push({
                speaker: 'ai',
                text: reply.trim(),
                timestamp: new Date()
              });

              // Pass the client's voice configuration to TTS
              const voiceConfig = clientData.voiceConfig || {};
              await sendTTSRequest(clientId, reply, voiceConfig);
            }
          } catch (err) {
            console.error('❌ Gemini error:', err);
            ws.send(JSON.stringify({ error: 'Gemini error: ' + err.message }));
          }
        } else if (text !== clientData.lastPartial) {
          clientData.lastPartial = text;
          ws.send(JSON.stringify({ partial: text }));
        }
      });

      transcriber.on('error', (err) => {
        console.error('❌ AssemblyAI error:', err);
        ws.send(JSON.stringify({ error: 'STT error: ' + err.message }));
      });
    })
    .catch((err) => {
      console.error('❌ Failed to initialize transcriber:', err);
      ws.send(JSON.stringify({ error: 'Failed to initialize transcription service' }));
    });

  async function setupCoachAndChat(coach) {
    const clientData = getClient(clientId);

    try {
      console.log('🎯 Setting up coach:',  coach.name);

      if (!coach.prompt || !coach.initialAIResponse) {
        ws.send(JSON.stringify({
          error: 'Coach configuration is incomplete (missing prompt or initial response)',
        }));
        return;
      }

      const newChat = await initializeChat(coach);
      clientData.chat = newChat;
      setClientCoach(clientId, coach);

      ws.send(JSON.stringify({ type: 'coachSetup', success: true, coach: coach.name }));

      console.log('✅ Coach setup complete, waiting for session start request');
    } catch (error) {
      console.error('❌ Error in setupCoachAndChat:', error);
      ws.send(JSON.stringify({ error: 'Failed to initialize coach: ' + error.message }));
    }
  }

  async function sendInitialMessage() {
    const clientData = getClient(clientId);

    if (!clientData.selectedCoach) {
      ws.send(JSON.stringify({ error: 'No coach selected' }));
      return;
    }

    if (clientData.isInitialMessageSent) {
      console.log('⚠️ Initial message already sent, skipping');
      return;
    }

    try {
      console.log('📨 Sending initial message for coach:', clientData.selectedCoach.name);

      const initialMessage = clientData.selectedCoach.initialAIResponse;

      // Add initial AI message to conversation history
      clientData.conversationHistory.push({
        speaker: 'ai',
        text: initialMessage,
        timestamp: new Date()
      });

      ws.send(JSON.stringify({
        type: 'initialMessage',
        geminiChunk: initialMessage,
      }));
      ws.send(JSON.stringify({ geminiDone: true }));

      // Use the client's voice configuration for initial message
      const voiceConfig = clientData.voiceConfig || {};
      await sendTTSRequest(clientId, initialMessage, voiceConfig);
      markInitialMessageSent(clientId);

      console.log('🔊 Initial message sent to Murf for TTS with voice config:', voiceConfig);
    } catch (ttsError) {
      console.error('❌ TTS Error:', ttsError);
      ws.send(JSON.stringify({ error: 'TTS service unavailable, but you can continue with text' }));
    }
  }

  async function handleEndSession() {
    const clientData = getClient(clientId);
    
    try {
      // Clear any pending TTS
      if (clientData.currentContextId) {
        await clearPreviousContext(clientId);
      }

      // Generate report if we have conversation history and session data
      let sessionId = null;
      if (clientData.conversationHistory && 
          clientData.conversationHistory.length > 0 && 
          clientData.selectedCoach &&
          clientData.sessionStartTime) {
        
        console.log('📊 Generating session report...');
        
        try {
          const finalUserId = clientData.userId 
          const coachType = clientData.coachType;

          const savedSession = await saveSessionAndGenerateReport(
            finalUserId,
            clientData.selectedCoach._id,
            clientData.conversationHistory,
            clientData.selectedCoach,
            clientData.sessionStartTime,
            coachType
          );
          
          sessionId = savedSession._id;
          console.log('✅ Session report generated with ID:', sessionId);
          
        } catch (reportError) {
          console.error('❌ Error generating report:', reportError);
          // Continue with session end even if report generation fails
        }
      }
      
      // Reset session state but keep the client connection
      clientData.isInitialMessageSent = false;
      clientData.lastFinalTranscript = null;
      clientData.lastPartial = null;
      clientData.isTTSActive = false;
      clientData.conversationHistory = [];
      clientData.sessionStartTime = null;
      
      console.log('✅ Session ended for client:', clientId);
      ws.send(JSON.stringify({ 
        type: 'sessionEnded', 
        success: true,
        sessionId: sessionId // Send session ID to client for report viewing
      }));
      
    } catch (error) {
      console.error('❌ Error ending session:', error);
      ws.send(JSON.stringify({ error: 'Failed to end session: ' + error.message }));
    }
  }

  ws.on('close', async () => {
    console.log('❌ Client disconnected:', clientId);
    if (transcriber) await transcriber.close();
    await clearPreviousContext(clientId);
    removeClient(clientId);
  });

  ws.on('error', (err) => {
    console.error('Client WebSocket error:', err);
  });
}

export default websocketHandler;