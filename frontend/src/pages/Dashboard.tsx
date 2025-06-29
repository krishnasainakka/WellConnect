import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy,
  Clock,
  MessageCircle,
  Heart,
  Target,
  Flame,  
  Loader2,
 
  Volume2
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import LatestTherapy from '../components/dashboard/LatestTherapy';
import LatestCommunication from '../components/dashboard/LatestCommunication';
import RecentActivity from '../components/dashboard/RecentActivity';

interface UserStats {
  totalSessions: number;
  averageScore: number;
  totalPracticeTime: number;
  totalPracticeTimeFormatted: string;
  recentActivity: Array<{
    sessionId: string;
    coachName: string;
    score: number;
    date: string;
    duration: string;
  }>;
}

interface CommunicationCoach {
  _id: string;
  name: string;
  shortDescription: string;
  category: string;
  avatarUrl: string;
}

interface TherapyCoach {
  _id: string;
  name: string;
  shortDescription: string;
  category: string;
  avatarUrl: string;
}

interface Quote {
  text: string;
  author: string;
}

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [recentCoaches, setRecentCoaches] = useState<CommunicationCoach[]>([]);
  const [recentTherapy, setRecentTherapy] = useState<TherapyCoach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);  
  const [todayQuote, setTodayQuote] = useState<Quote | null>(null);

  const userId = user?.id; 

  // Fetch user stats
  const fetchUserStats = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/reports/stats/${userId}`);
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      } else {
        console.log('No stats found for user - likely a new user');
        setStats(null);
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setStats(null);
    }
  };

  // Fetch recent coaches
  const fetchRecentCoaches = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/communication-coaches?limit=3`);
      const data = await response.json();
      
      if (data.success) {
        setRecentCoaches(data.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching coaches:', err);
    }
  };

  // Fetch recent therapy topics
  const fetchRecentTherapy = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/therapy?limit=3`);
      const data = await response.json();
      
      if (data.success) {
        setRecentTherapy(data.data.slice(0, 3));
      }
    } catch (err) {
      console.error('Error fetching therapy topics:', err);
    }
  };

  const handleSpeak = async () => {
  if (!todayQuote) return;

  try {
    const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/tts/stream`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        text: todayQuote.text,
        voiceId: 'en-US-natalie',
        style: 'Conversational',
        speed: 1.0,
      }),
    });

    if (!response.ok) throw new Error('Failed to stream TTS audio');

    // Read the stream into a blob
    const arrayBuffer = await response.arrayBuffer();
    const blob = new Blob([arrayBuffer], { type: 'audio/wav' });
    const audioURL = URL.createObjectURL(blob);

    // Play via HTMLAudioElement
    const audio = new Audio(audioURL);
    audio.play();
  } catch (err) {
    console.error('Error playing Murf TTS:', err);
  }
};


  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        await Promise.all([
          fetchUserStats(),
          fetchRecentCoaches(),
          fetchRecentTherapy()
        ]);
      } catch (err) {
        setError('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/quotes/daily`);
        const data = await res.json();
        setTodayQuote(data);
      } catch (error) {
        console.error('Failed to fetch daily quote:', error);
      }
    };

    fetchQuote();
  }, []);

  if (!user) return null;
  if (!todayQuote) return null;

  // Quick stats for display
  const quickStats = stats ? [
    { 
      label: 'Total Sessions', 
      value: stats.totalSessions, 
      icon: <MessageCircle className="w-5 h-5" />, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      label: 'Avg Score', 
      value: `${stats.averageScore}/100`, 
      icon: <Trophy className="w-5 h-5" />, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      label: 'Practice Time', 
      value: stats.totalPracticeTimeFormatted, 
      icon: <Clock className="w-5 h-5" />, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    { 
      label: 'Recent Sessions', 
      value: stats.recentActivity.length, 
      icon: <Flame className="w-5 h-5" />, 
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
  ] : [
    { 
      label: 'Total Sessions', 
      value: 0, 
      icon: <MessageCircle className="w-5 h-5" />, 
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20'
    },
    { 
      label: 'Avg Score', 
      value: 'N/A', 
      icon: <Trophy className="w-5 h-5" />, 
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20'
    },
    { 
      label: 'Practice Time', 
      value: '0m', 
      icon: <Clock className="w-5 h-5" />, 
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20'
    },
    { 
      label: 'Ready to Start', 
      value: '🚀', 
      icon: <Flame className="w-5 h-5" />, 
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-50 dark:bg-orange-900/20'
    },
  ];

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <p className="text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row gap-6"
      >
        <Card className="flex-1 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user.username}! 👋
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {stats ? 'Ready to continue your growth journey?' : 'Ready to start your growth journey?'}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {format(new Date(), 'EEEE, MMMM d')}
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              variant="primary" 
              className="flex items-center space-x-2"
              onClick={() => navigate('/conversation')}
            >
              <MessageCircle className="w-4 h-4" />
              <span>Start Practice Session</span>
            </Button>
            <Button 
              variant="secondary" 
              className="flex items-center space-x-2"
              onClick={() => navigate('/therapy')}
            >
              <Heart className="w-4 h-4" />
              <span>Begin Therapy Chat</span>
            </Button>
          </div>
        </Card>

        <Card className="lg:w-80 p-6">
          <div className="flex justify-between items-start mb-3">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
              <Target className="w-5 h-5 mr-2 text-blue-600" />
              Daily Quote
            </h3>
            <button
              onClick={handleSpeak}
              className="text-blue-600 hover:text-blue-800"
              title="Speak Quote"
            >
              <Volume2 className="w-5 h-5" />
            </button>
          </div>

          <blockquote className="italic text-gray-700 dark:text-gray-300 mb-3">
            "{todayQuote.text}"
          </blockquote>
          <p className="text-sm text-gray-500 dark:text-gray-400">— {todayQuote.author}</p>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="p-6 text-center">
              <div className={`${stat.bgColor} ${stat.color} mb-3 p-3 rounded-full w-fit mx-auto`}>
                {stat.icon}
              </div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {stat.label}
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Activity or Getting Started */}
        <RecentActivity stats={stats}/>

        {/* Quick Access & Recommendations */}
        <div className="space-y-6">
          {/* Communication Coaches */}
          <LatestCommunication recentCoaches={recentCoaches}/>

          {/* Therapy Topics */}
          <LatestTherapy recentTherapy={recentTherapy}/>
        </div>
      </div>
    </div>
  );
};


