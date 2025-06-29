import { AssemblyAI } from 'assemblyai';
import dotenv from 'dotenv';
dotenv.config();

const ASSEMBLY_API_KEY = process.env.ASSEMBLYAI_API_KEY;

export async function initializeTranscriber() {
  const aai = new AssemblyAI({ apiKey: ASSEMBLY_API_KEY });
  const transcriber = aai.streaming.transcriber({ sampleRate: 16000, encoding: 'pcm_s16le' });
  await transcriber.connect();
  return transcriber;
}

