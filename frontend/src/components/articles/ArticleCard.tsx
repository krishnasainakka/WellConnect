import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Tag, ArrowRight, BookOpen } from 'lucide-react';

interface Article {
  _id: string;
  title: string;
  shortDescription: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  estimatedReadTime?: string;
  author?: string;
  createdAt: string;
}

interface ArticleCardProps {
  article: Article;
  index: number;
  onClick: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, index, onClick }) => {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case 'communication':
        return 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'therapy':
        return 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800';
      default:
        return 'bg-gray-50 dark:bg-gray-900/20 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -4 }}
      className="group cursor-pointer"
      onClick={() => onClick(article._id)}
    >
      <div className="relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl overflow-hidden h-full flex flex-col border-2 border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300/50 dark:hover:border-gray-600/50 transition-all duration-300 shadow-lg group-hover:shadow-xl">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        {/* Thumbnail */}
        {article.thumbnailUrl ? (
          <div className="relative h-48 overflow-hidden">
            <img
              src={article.thumbnailUrl}
              alt={article.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border-2 ${getCategoryColor(article.category)}`}>
              {article.category}
            </div>
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-to-br from-blue-500/10 to-purple-500/10 flex items-center justify-center">
            <BookOpen className="w-16 h-16 text-gray-400 dark:text-gray-600" />
            <div className={`absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium border-2 ${getCategoryColor(article.category)}`}>
              {article.category}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="relative p-6 flex-1 flex flex-col">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {article.title}
          </h3>
          
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed flex-1">
            {article.shortDescription}
          </p>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {article.tags.slice(0, 3).map((tag, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
              {article.tags.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600">
                  +{article.tags.length - 3} more
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
              {article.estimatedReadTime && (
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{article.estimatedReadTime}</span>
                </div>
              )}
              {article.author && (
                <div className="flex items-center space-x-1">
                  <User className="w-3 h-3" />
                  <span>{article.author}</span>
                </div>
              )}
            </div>
            
            <motion.div
              whileHover={{ x: 4 }}
              className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-medium"
            >
              <span>Read More</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};