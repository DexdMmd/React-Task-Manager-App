
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
// UserPlusIcon removed, FolderOpenIcon replaced by img tag

interface RegisterPageProps {
  onRegister: (credentials: { name?: string; email?: string; password?: string }) => void;
  onNavigateToLogin: () => void;
}

export const RegisterPage: React.FC<RegisterPageProps> = ({ onRegister, onNavigateToLogin }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert(t('passwordsDoNotMatch') || 'Passwords do not match!'); 
      return;
    }
    if (!name.trim() || !email.trim() || !password.trim()) {
       alert(t('errorRequired', { context: "register" }) || 'Name, Email, and Password are required.');
       return;
    }
    onRegister({ name, email, password });
  };
  
  const commonInputClass = "w-full p-3 bg-gray-100 dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent outline-none transition-colors text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-400 dark:hover:border-gray-500";


  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white dark:bg-dark-card shadow-xl rounded-xl backdrop-blur-md bg-opacity-80 dark:bg-opacity-70 border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col items-center">
          <img src="/logo.png" alt={t('taskManager') || "Task Manager Logo"} className="w-16 h-16 mb-4" />
          <h2 className="text-3xl font-bold text-center text-gray-800 dark:text-white">{t('register')}</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="name-register" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('name', 'Name')}</label>
            <input
              type="text"
              id="name-register"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={commonInputClass}
              placeholder={t('name', 'Your Name') || "Your Name"}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <label htmlFor="email-register" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('email')}</label>
            <input
              type="email"
              id="email-register"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={commonInputClass}
              placeholder={t('email') || "you@example.com"}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label htmlFor="password-register" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('password')}</label>
            <input
              type="password"
              id="password-register"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={commonInputClass}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword-register" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('confirmPassword')}</label>
            <input
              type="password"
              id="confirmPassword-register"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={commonInputClass}
              placeholder="••••••••"
              required
              autoComplete="new-password"
            />
          </div>
          <button 
            type="submit" 
            className="w-full flex items-center justify-center p-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            aria-label={t('register') || "Register new account"}
          >
             {/* UserPlusIcon removed */}
            {t('register')}
          </button>
        </form>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          {t('alreadyHaveAccount')}{' '}
          <button onClick={onNavigateToLogin} className="font-medium text-primary hover:text-primary-dark dark:text-accent dark:hover:text-violet-400 hover:opacity-80 transition-opacity duration-200">
            {t('login')}
          </button>
        </p>
      </div>
    </div>
  );
};
