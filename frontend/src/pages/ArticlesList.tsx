import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle, RefreshCw, Search } from 'lucide-react';
import { ArticleHeader } from '../components/articles/ArticleHeader';
import { ArticleFilters } from '../components/articles/ArticleFilters';
import { ArticleCard } from '../components/articles/ArticleCard';
import { Button } from '../components/ui/Button';

interface Article {
  _id: string;
  title: string;
  shortDescription: string;
  fullContent: string;
  category: string;
  tags: string[];
  thumbnailUrl?: string;
  estimatedReadTime?: string;
  author?: string;
  createdAt: string;
}

const ArticlesList: React.FC = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${import.meta.env.VITE_REACT_APP_BACKEND_BASEURL}/api/articles`);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error fetching articles:', err);
      setError('Failed to load articles. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.shortDescription.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         article.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || article.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const handleArticleClick = (id: string) => {
    navigate(`/articles/${id}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl mx-auto flex items-center justify-center mb-6">
              <Loader2 className="w-8 h-8 animate-spin text-white" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Loading Articles</h3>
            <p className="text-gray-600 dark:text-gray-400">Gathering the latest insights for you...</p>
          </motion.div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-4 sm:p-6">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-md"
          >
            <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-2xl mx-auto flex items-center justify-center mb-6 border-2 border-red-200 dark:border-red-800">
              <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Unable to load articles
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <Button 
              variant="primary" 
              onClick={fetchArticles}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="p-4 sm:p-6 space-y-6 sm:space-y-8">
        {/* Header */}
        <ArticleHeader totalArticles={articles.length} />

        {/* Filters */}
        <ArticleFilters
          searchTerm={searchTerm}
          selectedCategory={selectedCategory}
          onSearchChange={setSearchTerm}
          onCategoryChange={setSelectedCategory}
        />

        {/* Articles Grid */}
        {filteredArticles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredArticles.map((article, index) => (
              <ArticleCard
                key={article._id}
                article={article}
                index={index}
                onClick={handleArticleClick}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-3xl mx-auto flex items-center justify-center mb-8">
              <Search className="w-12 h-12 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              No articles found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              {searchTerm || selectedCategory !== 'All' 
                ? 'Try adjusting your search terms or filters to find more articles.'
                : 'No articles are available at the moment. Check back later for new content.'
              }
            </p>
            {(searchTerm || selectedCategory !== 'All') && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-xl font-medium hover:from-purple-600 hover:to-indigo-700 transition-all"
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ArticlesList;