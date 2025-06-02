
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ExclamationTriangleIcon, ArrowUturnLeftIcon } from './icons/HeroIcons';

interface NotFoundPageProps {
    onNavigateHome: () => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigateHome }) => {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-center p-4">
      <ExclamationTriangleIcon className="w-24 h-24 text-yellow-400 dark:text-yellow-500 mb-6 transition-all duration-300 ease-in-out hover:opacity-80 hover:scale-105" />
      <h1 className="text-5xl font-bold text-gray-800 dark:text-white mb-4">404</h1>
      <p className="text-2xl text-gray-600 dark:text-gray-300 mb-8">{t('notFound.title', 'Oops! Page Not Found.')}</p>
      <p className="text-lg text-gray-500 dark:text-gray-400 mb-8">
        {t('notFound.message', 'The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.')}
      </p>
      <button
        onClick={onNavigateHome}
        className="flex items-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        aria-label={t('notFound.goHomeButton') || "Go back to homepage"}
      >
        <ArrowUturnLeftIcon className="w-5 h-5 mr-2" />
        {t('notFound.goHomeButton', 'Go Back Home')}
      </button>
    </div>
  );
};
