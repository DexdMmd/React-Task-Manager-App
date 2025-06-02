
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { LoginIcon as SignInIcon, UserCircleIcon } from './icons/HeroIcons'; 

interface LoginPageProps {
  onLogin: (credentials: { emailOrUsername?: string; password?: string }) => void;
  onGuestLogin: () => void;
  // onNavigateToRegister prop removed
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGuestLogin }) => {
  const { t } = useTranslation();
  const [emailOrUsername, setEmailOrUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailOrUsername.trim() || !password.trim()) {
      alert(t("errorLoginFieldsMissing") || "Email/Username and Password are required."); 
      return;
    }
    onLogin({ emailOrUsername, password });
  };
  
  const commonInputClass = "w-full p-3 bg-gray-100 dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent outline-none transition-colors text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-400 dark:hover:border-gray-500";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-dark-card shadow-xl rounded-xl backdrop-blur-md bg-opacity-80 dark:bg-opacity-70 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt={t('taskManager') || "Task Manager Logo"} className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">{t('login')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="emailOrUsername-login" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('emailOrUsername')}</label>
            <input
              type="text" // Changed from email to text to allow usernames
              id="emailOrUsername-login"
              value={emailOrUsername}
              onChange={(e) => setEmailOrUsername(e.target.value)}
              className={commonInputClass}
              placeholder={t('emailOrUsernamePlaceholder') || "your.email@example.com or username"}
              required
              autoComplete="username" // Works for both email and username
            />
          </div>
          <div>
            <label htmlFor="password-login" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('password')}</label>
            <input
              type="password"
              id="password-login"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={commonInputClass}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center p-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            aria-label={t('login') || "Login"}
          >
            <SignInIcon className="w-5 h-5 mr-2" />
            {t('login')}
          </button>
        </form>
        
        <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 dark:before:border-neutral-600 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300 dark:after:border-neutral-600">
          <p className="mx-4 mb-0 text-center font-semibold text-gray-600 dark:text-gray-300">OR</p>
        </div>

        <button 
          onClick={onGuestLogin}
          type="button"
          className="w-full flex items-center justify-center p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-600 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 font-semibold rounded-lg shadow-md hover:shadow-xl transition-all duration-300 ease-in-out transform hover:scale-105"
          aria-label={t('loginAsGuest') || "Login as Guest"}
        >
          <UserCircleIcon className="w-5 h-5 mr-2" />
          {t('loginAsGuest')}
        </button>
        
        {/* Navigation to Register page removed */}
      </div>
    </div>
  );
};
