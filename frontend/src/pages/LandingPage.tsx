import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Brain, 
  MessageCircle, 
  Heart, 
  BarChart3, 
  Award, 
  Shield,
  Zap,
  Users,
  CheckCircle,
  ArrowRight,
  Play
} from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useTheme } from '../contexts/ThemeContext';

const features = [
  {
    icon: <MessageCircle className="w-8 h-8" />,
    title: 'AI Communication Coach',
    description: 'Practice real workplace scenarios with AI-powered role-playing partners'
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: 'Mental Health Support',
    description: 'Get personalized therapy sessions and mental wellness guidance'
  },
  {
    icon: <BarChart3 className="w-8 h-8" />,
    title: 'Progress Analytics',
    description: 'Track your improvement with detailed reports and insights'
  },
  {
    icon: <Award className="w-8 h-8" />,
    title: 'Gamified Learning',
    description: 'Earn badges and achievements as you develop your skills'
  }
];

const benefits = [
  'Improve communication confidence',
  'Reduce workplace anxiety',
  'Practice difficult conversations safely',
  'Access 24/7 mental health support',
  'Track your personal development',
  'Build resilience and emotional intelligence'
];

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Brain className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                WellConnect AI
              </span>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <Button
                variant="ghost"
                onClick={toggleTheme}
                className="p-2"
              >
                {theme === 'light' ? '🌙' : '☀️'}
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate('/login')}
                className="text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                Login
              </Button>
              <Button
                variant="primary"
                onClick={() => navigate('/signup')}
                className="text-sm px-3 py-2 sm:px-4 sm:py-2"
              >
                Get Started
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-12 sm:py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight"
            >
              Transform Your
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600 block sm:inline">
                {' '}Workplace Communication
              </span>
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl lg:text-2xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-4xl mx-auto leading-relaxed px-4"
            >
              Practice difficult conversations, manage workplace stress, and build confidence with 
              AI-powered coaching and personalized mental health support.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4"
            >
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/signup')}
                className="flex items-center space-x-2 w-full sm:w-auto"
              >
                <span>Start Your Journey</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="flex items-center space-x-2 w-full sm:w-auto"
              >
                <Play className="w-5 h-5" />
                <span>Watch Demo</span>
              </Button>
            </motion.div>
          </div>
        </div>
        
        {/* Floating Elements - Hidden on mobile */}
        <div className="absolute top-20 left-4 sm:left-10 opacity-20 hidden sm:block">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <Brain className="w-12 sm:w-16 h-12 sm:h-16 text-blue-500" />
          </motion.div>
        </div>
        <div className="absolute bottom-20 right-4 sm:right-10 opacity-20 hidden sm:block">
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            <Heart className="w-8 sm:w-12 h-8 sm:h-12 text-teal-500" />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Powerful Features for Professional Growth
            </h2>
            <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Everything you need to improve your workplace communication and mental well-being
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="p-6 text-center h-full">
                  <div className="text-blue-600 dark:text-blue-400 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-12 sm:py-20 bg-gradient-to-r from-blue-600 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-6">
                Why Choose WellConnect AI?
              </h2>
              <div className="space-y-3 sm:space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="flex items-center space-x-3"
                  >
                    <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6 text-green-300 flex-shrink-0" />
                    <span className="text-white text-base sm:text-lg">{benefit}</span>
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="relative">
              <Card className="p-6 sm:p-8">
                <div className="text-center">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    Join 10,000+ Professionals
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-6 text-sm sm:text-base">
                    Who have already transformed their workplace communication and mental well-being
                  </p>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-blue-600">95%</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-teal-600">24/7</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Support</div>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-purple-600">50k+</div>
                      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Sessions</div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Ready to Transform Your Professional Life?
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8">
            Start your journey to better communication and mental well-being today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center px-4">
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/signup')}
              className="flex items-center space-x-2 w-full sm:w-auto"
            >
              <Zap className="w-5 h-5" />
              <span>Get Started Free</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="flex items-center space-x-2 w-full sm:w-auto"
            >
              <Shield className="w-5 h-5" />
              <span>Learn More</span>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Brain className="w-6 h-6 sm:w-8 sm:h-8 text-blue-400" />
              <span className="text-xl sm:text-2xl font-bold">WellConnect AI</span>
            </div>
            <p className="text-gray-400 mb-6 sm:mb-8 text-sm sm:text-base">
              Empowering professionals through AI-driven communication coaching and mental health support
            </p>
            <div className="border-t border-gray-800 pt-6 sm:pt-8">
              <p className="text-gray-500 text-sm">
                © 2024 WellConnect AI. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};