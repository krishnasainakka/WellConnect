import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  MessageCircle, 
  Heart, 
  BarChart3, 
  Award,
  Sparkles,
  // Plus,
  // ChevronDown,
  ChevronRight,
  BookOpen
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  path?: string;
  children?: SidebarItem[];
}

const sidebarItems: SidebarItem[] = [
  { icon: <Home className="w-5 h-5" />, label: 'Dashboard', path: '/dashboard' },
  { icon: <MessageCircle className="w-5 h-5" />, label: 'Communication Coach', path: '/conversation' },
  { icon: <Heart className="w-5 h-5" />, label: 'Therapy Assistant', path: '/therapy' },
  { icon: <BookOpen className="w-5 h-5" />, label: 'Articles', path: '/articles' },
  { icon: <Sparkles className="w-5 h-5" />, label: 'Growth Stories', path: '/growth-stories' },
  { icon: <BarChart3 className="w-5 h-5" />, label: 'Session History', path: '/history' },
  { icon: <Award className="w-5 h-5" />, label: 'Achievements', path: '/achievements' },
  // { 
  //   icon: <Plus className="w-5 h-5" />, 
  //   label: 'Post', 
  //   children: [
  //     { icon: <MessageCircle className="w-4 h-4" />, label: 'Communication Coach', path: '/post/communication' },
  //     { icon: <Heart className="w-4 h-4" />, label: 'Therapy Topic', path: '/post/therapy' },
  //     { icon: <Award className="w-4 h-4" />, label: 'Badge', path: '/post/badge' },
  //   ]
  // },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [expandedItems, setExpandedItems] = useState<string[]>(['Post']);

  const handleNavigation = (path: string) => {
    navigate(path);
    // Close sidebar on mobile after navigation
    if (window.innerWidth < 1024) {
      onClose();
    }
  };

  const toggleExpanded = (label: string) => {
    setExpandedItems(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label)
        : [...prev, label]
    );
  };

  const isActive = (path?: string) => {
    if (!path) return false;
    return location.pathname === path;
  };

  const isParentActive = (children?: SidebarItem[]) => {
    if (!children) return false;
    return children.some(child => child.path && location.pathname === child.path);
  };

  const renderSidebarItem = (item: SidebarItem, level = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.label);
    const itemIsActive = isActive(item.path);
    const parentIsActive = isParentActive(item.children);

    return (
      <div key={item.label}>
        <motion.button
          whileHover={{ x: 4 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            if (hasChildren) {
              toggleExpanded(item.label);
            } else if (item.path) {
              handleNavigation(item.path);
            }
          }}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg text-left transition-all duration-200 ${
            level > 0 ? 'ml-4 pl-6' : ''
          } ${
            itemIsActive || parentIsActive
              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-r-2 border-blue-600'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
          }`}
        >
          <div className="flex items-center space-x-3">
            {item.icon}
            <span className="font-medium">{item.label}</span>
          </div>
          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="w-4 h-4" />
            </motion.div>
          )}
        </motion.button>

        {/* Children */}
        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="mt-1 space-y-1">
                {item.children!.map(child => renderSidebarItem(child, level + 1))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -300 }}
        animate={{ x: isOpen ? 0 : -300 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 h-full fixed left-0 top-0 z-50 lg:z-40 lg:translate-x-0"
      >
        <div className="p-6 pt-20">
          <nav className="space-y-2">
            {sidebarItems.map(item => renderSidebarItem(item))}
          </nav>
        </div>
      </motion.aside>
    </>
  );
};