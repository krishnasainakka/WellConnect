import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import {
  TrendingUp,
  Play,
  Users,
  BookOpen,
  Star,
  MessageCircle,
  Heart,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface Activity {
  sessionId: string;
  coachName: string;
  duration: string;
  date: string;
  score?: number;
}

interface Stats {
  recentActivity: Activity[];
}

interface Props {
  stats: Stats | null;
}

const RecentActivity: React.FC<Props> = ({ stats }) => {
  const navigate = useNavigate();

  const hasActivity = stats && stats.recentActivity.length > 0;

  return (
    <Card className='lg:col-span-2 p-6'>
      {hasActivity ? (
        <>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
            Recent Activity
          </h3>

          <div className="space-y-4">
            {stats!.recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                      Communication Practice
                    </span>
                    {activity.score !== undefined && (
                      <span className="flex items-center text-xs text-green-600 dark:text-green-400">
                        <Star className="w-3 h-3 mr-1" />
                        {activity.score}/100
                      </span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    Session with {activity.coachName}
                  </p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Duration: {activity.duration}</span>
                    <span>{format(new Date(activity.date), 'MMM d, h:mm a')}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate(`/session-report/${activity.sessionId}`)}
                >
                  View Report
                </Button>
              </motion.div>
            ))}
          </div>

          <div className="mt-4 text-center">
            <Button
              variant="outline"
              onClick={() => navigate('/history')}
              className="flex items-center space-x-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>View All Sessions</span>
            </Button>
          </div>
        </>
      ) : (
        <>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Play className="w-5 h-5 mr-2 text-blue-600" />
            Getting Started
          </h3>

          <div className="text-center py-8">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Welcome to WellConnect AI!
            </h4>
            <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
              Start your journey by practicing communication skills or exploring therapy topics.
              Your progress will appear here as you complete sessions.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                variant="primary"
                onClick={() => navigate('/conversation')}
                className="flex items-center space-x-2"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Try Communication Coach</span>
              </Button>
              <Button
                variant="secondary"
                onClick={() => navigate('/therapy')}
                className="flex items-center space-x-2"
              >
                <Heart className="w-4 h-4" />
                <span>Explore Therapy Topics</span>
              </Button>
            </div>
          </div>
        </>
      )}
    </Card>
  );
};

export default RecentActivity;
