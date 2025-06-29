const activeClients = new Map();

export function getClientId() {
  return Date.now() + '_' + Math.random().toString(36).slice(2);
}

export function addClient(id, data = {}) {
  activeClients.set(id, {
    ...data,
    // Required for real-time voice session
    ws: data.ws || null,
    transcriber: data.transcriber || null,
    chat: data.chat || null,

    // User info
    userId: data.userId || null,

    // Conversation tracking
    conversationHistory: [],
    sessionStartTime: null,

    // Runtime state
    lastPartial: '',
    lastFinalTranscript: '',
    currentContextId: null,
    isTTSActive: false,
    isInitialMessageSent: false,

    // Coach + Voice
    selectedCoach: null,
    voiceConfig: null,
    coachType: null,
  });
}

export function getClient(id) {
  return activeClients.get(id);
}


export function removeClient(id) {
  activeClients.delete(id);
}


export function setClientInactive(id) {
  const client = getClient(id);
  if (client) client.isTTSActive = false;
}


export function setClientCoach(id, coach) {
  const client = getClient(id);
  if (client) {
    client.selectedCoach = coach;
    client.isInitialMessageSent = false;
  }
}

export function markInitialMessageSent(id) {
  const client = getClient(id);
  if (client) {
    client.isInitialMessageSent = true;
  }
}


export function setClientVoiceConfig(clientId, voiceConfig) {
  const client = getClient(clientId);
  if (client) {
    client.voiceConfig = voiceConfig;
    console.log(`🎚️ Voice config set for client ${clientId}:`, voiceConfig);
  } else {
    console.warn(`⚠️ Client ${clientId} not found when setting voice config`);
  }
}


export function getClientVoiceConfig(clientId) {
  const client = getClient(clientId);
  return client?.voiceConfig || null;
}