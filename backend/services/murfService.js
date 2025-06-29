import WebSocket from 'ws';
import { getClient, setClientInactive } from '../utils/clientManager.js';
import dotenv from 'dotenv';
dotenv.config();

const MURF_API_KEY = process.env.MURF_API_KEY;
const MURF_WS_URL = 'wss://api.murf.ai/v1/speech/stream-input';

let globalMurfWs = null;
let murfConnected = false;
let murfConnectionPromise = null;
let contextCounter = 0;
const pendingAudioChunks = new Map();

function initializeGlobalMurfConnection() {
  if (murfConnected && globalMurfWs?.readyState === WebSocket.OPEN) return Promise.resolve();
  if (murfConnectionPromise) return murfConnectionPromise;

  const url = `${MURF_WS_URL}?api-key=${MURF_API_KEY}&sample_rate=44100&channel_type=MONO&format=MP3`;
  globalMurfWs = new WebSocket(url);

  murfConnectionPromise = new Promise((resolve, reject) => {
    globalMurfWs.on('open', () => {
      console.log(' Murf WebSocket open');
      murfConnected = true;
      murfConnectionPromise = null;
      resolve();
    });

    globalMurfWs.on('message', (data) => {
      // console.log('Murf WS Message:', data.toString());
      const res = JSON.parse(data.toString());
      const ctx = pendingAudioChunks.get(res.context_id);
      const client = getClient(ctx?.clientId);
      if (res.audio && client?.ws?.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({ ttsAudioChunk: res.audio, contextId: res.context_id }));
      }
      if ((res.is_final || res.final) && client?.ws?.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({ ttsDone: true, contextId: res.context_id }));
        setClientInactive(ctx?.clientId);
        pendingAudioChunks.delete(res.context_id);
      }
      if (res.error && client?.ws?.readyState === WebSocket.OPEN) {
        client.ws.send(JSON.stringify({ error: 'TTS error: ' + res.error }));
        setClientInactive(ctx?.clientId);
        pendingAudioChunks.delete(res.context_id);
      }
    });

    globalMurfWs.on('close', () => {
      console.log(' Murf WebSocket closed');
      murfConnected = false;
      murfConnectionPromise = null;
    });

    globalMurfWs.on('error', (err) => {
      console.error(' Murf WebSocket error:', err);
      murfConnected = false;
      murfConnectionPromise = null;
      reject(err);
    });
  });
  return murfConnectionPromise;
}

export async function sendTTSRequest(clientId, text, voiceConfig = {}) {
  const client = getClient(clientId);
  if (!client) {
    console.error(` Murf socket not found for client: ${clientId}`);
    return;
  }

  client.isTTSActive = true;
  await initializeGlobalMurfConnection();

  if (client.currentContextId) {
    try {
      globalMurfWs.send(JSON.stringify({ context_id: client.currentContextId, clear: true }));
      pendingAudioChunks.delete(client.currentContextId);
    } catch (e) {
      console.warn('Could not clear previous Murf context:', e.message);
    }
  }

  const contextId = `client_${clientId}_turn_${++contextCounter}`;
  client.currentContextId = contextId;
  pendingAudioChunks.set(contextId, { clientId, userId: client.userId, chunks: [] });

  // Use the provided voice configuration or fall back to defaults
  const mergedVoiceConfig = {
    voiceId: voiceConfig.voiceId || 'en-US-amara',
    style: voiceConfig.style || 'Conversational',
    rate: voiceConfig.rate !== undefined ? voiceConfig.rate : 0,
    pitch: voiceConfig.pitch !== undefined ? voiceConfig.pitch : 0,
    variation: voiceConfig.variation !== undefined ? voiceConfig.variation : 1
  };

  console.log(' Using voice configuration for TTS:', mergedVoiceConfig);

  try {
    globalMurfWs.send(JSON.stringify({
      context_id: contextId,
      voice_config: mergedVoiceConfig,
      text: text.trim(),
      end: true
    }));
    
    console.log(` TTS request sent for client ${clientId} (user: ${client.userId || 'guest'}) with voice: ${mergedVoiceConfig.voiceId}`);
  } catch (error) {
    console.error(' Error sending TTS request:', error);
    if (client?.ws?.readyState === WebSocket.OPEN) {
      client.ws.send(JSON.stringify({ error: 'Failed to send TTS request: ' + error.message }));
    }
    setClientInactive(clientId);
    pendingAudioChunks.delete(contextId);
  }
}

export async function clearPreviousContext(clientId) {
  const client = getClient(clientId);
  if (client?.currentContextId && globalMurfWs?.readyState === WebSocket.OPEN) {
    try {
      globalMurfWs.send(JSON.stringify({ context_id: client.currentContextId, clear: true }));
      pendingAudioChunks.delete(client.currentContextId);
      console.log(` Cleared previous context for client ${clientId}`);
    } catch (error) {
      console.warn('Could not clear previous Murf context:', error.message);
    }
  }
}
