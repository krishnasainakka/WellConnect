import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';


interface CommunicationCoach {
  _id: string;
  name: string;
  topic: string;
  category: string;
  avatarUrl: string;
}

interface LatestCommunicationProps {
  recentCoaches: CommunicationCoach[];
}

const LatestCommunication: React.FC<LatestCommunicationProps> = ({ recentCoaches }) => {
  const navigate = useNavigate();

  return (
    <Card className='p-6'>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <MessageCircle className="w-5 h-5 mr-2 text-blue-600" />
        Communication Coaches
      </h3>

      {recentCoaches.length > 0 ? (
        <div className="space-y-3">
          {recentCoaches.map((coach) => (
            <div
              key={coach._id}
              className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <img
                src={coach.avatarUrl}
                alt={coach.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                  {coach.name}
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400">
                  {coach.topic}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate(`/voice-assistant/communication-coach/${coach._id}`)}
                className="text-xs"
              >
                Start
              </Button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4">
          <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No coaches available</p>
        </div>
      )}

      <Button
        variant="outline"
        size="sm"
        className="w-full mt-4"
        onClick={() => navigate('/conversation')}
      >
        View All Coaches
      </Button>
    </Card>
  );
};

export default LatestCommunication;
