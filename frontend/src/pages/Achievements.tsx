import React from 'react';

const AchievementsPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 md:p-12 text-center border border-gray-200 dark:border-gray-700 max-w-lg w-full transform transition-all duration-300 hover:scale-105">
        <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-600 dark:text-indigo-400 mb-4 animate-pulse">
          Badges
        </h1>
        <p className="text-xl md:text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-6">
          This page is currently under construction.
        </p>
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400">
          Stay tuned! Your earned badges will be displayed here soon.
        </p>
        <div className="mt-8">
          {/* Optional: Add a placeholder icon or animation */}
          <svg
            className="mx-auto h-24 w-24 text-indigo-500 dark:text-indigo-400 opacity-75"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.527.272 1.04.562 1.5.929z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default AchievementsPage;
