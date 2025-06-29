# WellConnect AI - Employee Well-being Platform

A comprehensive platform that empowers employees to overcome communication challenges and manage mental health through interactive, personalized AI-driven practice and support.

## Project Structure

```
wellconnect-ai/
├── frontend/          # React.js frontend application
│   ├── src/          # Source code
│   ├── public/       # Static assets
│   └── package.json  # Frontend dependencies
├── backend/          # Express.js backend API
│   ├── index.js      # Main server file
│   ├── .env          # Environment variables
│   └── package.json  # Backend dependencies
└── README.md         # This file
```

## Features

### 🎯 Communication Coach
- Interactive voice-based scenario practicing
- Real-time AI feedback and scoring
- Multiple difficulty levels and categories
- Speech analytics and improvement tracking

### 🧠 Therapy Assistant
- AI-powered mental health support
- Voice-based therapy sessions
- 24/7 availability

### 📊 Analytics & Reporting
- Comprehensive session reports
- Progress tracking and visualization

### 🏆 Gamification(Still in Progress....)
- Achievement badges for completing Communication Coach and Therapy Assiatant with good score
- Progress milestones
- Personalized goals and challenges

## Technology Stack

### Frontend
- **React.js** with TypeScript
- **Tailwind CSS** for styling
- **Framer Motion** for animations
- **React Router** for navigation
- **Lucide React** for icons

### Backend
- **Express.js** (Node.js)
- **MongoDB** with Mongoose
- **CORS** enabled
- **Environment configuration**

### Planned Integrations
- **Google Gemini** - AI Language Model
- **AssemblyAI** - Speech-to-Text
- **Murf AI** - Text-to-Speech

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd wellconnect-ai
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Configure your environment variables
   npm run dev
   ```

3. **Setup Frontend** (in a new terminal)
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8080

### Environment Configuration

#### Backend (.env)
```
MONGODB_URI=
PORT=8080
JWT_SECRET=
MURF_API_KEY=
ASSEMBLYAI_API_KEY=
GEMINI_API_KEY=
```

#### Frontend (.env)
```
VITE_REACT_APP_BACKEND_BASEURL=http://localhost:8080
VITE_WEBSOCKET_URL=ws://localhost:8080
```

## Development

### Frontend Development
```bash
cd frontend
npm run dev      # Start development server
npm run build    # Build for production
npm run lint     # Run ESLint
```

### Backend Development
```bash
cd backend
npm run dev      # Start with auto-reload
npm start        # Start production server
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please open an issue in the repository or contact the development team.
