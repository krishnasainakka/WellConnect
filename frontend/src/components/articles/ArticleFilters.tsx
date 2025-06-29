import React from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, BookOpen, MessageCircle, Heart } from 'lucide-react';

interface ArticleFiltersProps {
  searchTerm: string;
  selectedCategory: string;
  onSearchChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
}

const categories = [
  { value: 'All', label: 'All Articles', icon: BookOpen, color: 'from-purple-500 to-indigo-600' },
  { value: 'Communication', label: 'Communication', icon: MessageCircle, color: 'from-blue-500 to-cyan-600' },
  { value: 'Therapy', label: 'Therapy', icon: Heart, color: 'from-red-500 to-pink-600' }
];

export const ArticleFilters: React.FC<ArticleFiltersProps> = ({
  searchTerm,
  selectedCategory,
  onSearchChange,
  onCategoryChange
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl p-4 sm:p-6 border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg"
    >
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
        {/* Search */}
        <div className="flex-1">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search articles, topics, or keywords..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-gray-50/50 dark:bg-gray-700/50 border-2 border-gray-200/50 dark:border-gray-600/50 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent transition-all backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-3">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <motion.button
                key={category.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryChange(category.value)}
                className={`flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCategory === category.value
                    ? `bg-gradient-to-r ${category.color} text-white`
                    : 'bg-gray-100/50 dark:bg-gray-700/50 text-gray-700 dark:text-gray-300 hover:bg-gray-200/50 dark:hover:bg-gray-600/50 backdrop-blur-sm border-2 border-gray-200/50 dark:border-gray-600/50'
                }`}
              >
                <IconComponent className="w-4 h-4" />
                <span className="hidden sm:inline">{category.label}</span>
                <span className="sm:hidden">{category.label.split(' ')[0]}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
};