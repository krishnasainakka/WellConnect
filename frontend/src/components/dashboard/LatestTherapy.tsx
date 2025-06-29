import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

interface TherapyTopic {
  _id: string;
  name: string;
  category: string;
  avatarUrl: string;
}

interface LatestTherapyProps {
  recentTherapy: TherapyTopic[];
}

const LatestTherapy: React.FC<LatestTherapyProps> = ({ recentTherapy }) => {
  const navigate = useNavigate();

  return (
    <Card className='p-6'>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <Heart className="w-5 h-5 mr-2 text-red-600" />
        Therapy Support
      </h3>

      {recentTherapy.length > 0 ? (
        <div className="space-y-3">
          {recentTherapy.map((topic) => (
            <div
              key={topic._id}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <img
                src={topic.avatarUrl}
                alt={topic.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {topic.name}
                </p>
                <p className="text-xs text-red-600 dark:text-red-400">
                  {topic.category}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/voice-assistant/therapy/${topic._id}`)}
                className="text-xs"
              >
                Start
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <Heart className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No topics available</p>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-4"
        onClick={() => navigate('/therapy')}
      >
        Explore All Topics
      </Button>
    </Card>
  );
};

export default LatestTherapy;
