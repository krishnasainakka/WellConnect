import React from 'react';
import { motion } from 'framer-motion';
import { Clock, User, Calendar, Tag } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Article {
  _id: string;
  title: string;
  shortDescription: string;
  fullContent: string; // in markdown format
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  estimatedReadTime?: string;
  author?: string;
  createdAt: string;
}

interface ArticleContentProps {
  article: Article;
}

export const ArticleContent: React.FC<ArticleContentProps> = ({ article }) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl rounded-2xl border-2 border-gray-200/50 dark:border-gray-700/50 shadow-lg overflow-hidden"
    >
      {/* Header Image */}
      {article.thumbnailUrl && (
        <div className="relative h-64 sm:h-80 overflow-hidden">
          <img
            src={article.thumbnailUrl}
            alt={article.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
          <div
            className={`absolute top-6 left-6 px-4 py-2 rounded-full text-sm font-medium border-2 ${getCategoryColor(
              article.category
            )}`}
          >
            {article.category}
          </div>
        </div>
      )}

      {/* Content */}
      <div className="p-6 sm:p-8">
        {/* Title and Meta */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            {article.title}
          </h1>

          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
            {article.shortDescription}
          </p>

          <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-6">
            {article.author && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span>{article.author}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(article.createdAt)}</span>
            </div>
            {article.estimatedReadTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>{article.estimatedReadTime}</span>
              </div>
            )}
          </div>

          {/* Tags */}
          {article.tags && article.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {article.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600"
                >
                  <Tag className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Article Markdown Content */}
        <div className="prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-300">
          <ReactMarkdown>{article.fullContent}</ReactMarkdown>
        </div>
      </div>
    </motion.div>
  );
};
