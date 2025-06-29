import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import { WebSocketServer } from 'ws';

import connectDB from './db.js';
import userRoutes from './routes/userRoutes.js';
import communicationCoachRoutes from './routes/communicationCoachRoutes.js';
import therapyRoutes from './routes/therapyRoutes.js';
import websocketHandler from './routes/websocket.js';
// import badgeRoutes from './routes/badgeRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import murfRoutes from './routes/murfRoutes.js';
import articlesRoutes from './routes/articlesRoutes.js';
import quotesRoutes from './routes/quotesRoutes.js';

// Load environment variables from .env file
dotenv.config();

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = process.env.PORT || 8080;

// Middleware 
app.use(cors()); 
app.use(express.json()); 

connectDB();

// REST API routes (uncomment to enable)
app.use('/api/users', userRoutes);
app.use('/api/communication-coaches', communicationCoachRoutes);
app.use('/api/therapy', therapyRoutes);
// app.use('/api/badges', badgeRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/articles', articlesRoutes);
app.use('/api/tts', murfRoutes);
app.use('/api/quotes', quotesRoutes);

app.get('/', (req, res) => res.send('Voice Chatbot backend running'));


wss.on('connection', (ws) => { 
  console.log('New WS connection received');
  websocketHandler(ws); 
});

// Start the HTTP server and listen on the specified port
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
}); 