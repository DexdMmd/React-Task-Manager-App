
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskStatus, User } from '../types';
import { SunIcon, MoonIcon, UserCircleIcon, CogIcon, LogoutIcon, ChevronDownIcon, /* FolderOpenIcon removed */ LoginIcon as SignInIcon, ArrowUturnLeftIcon, GlobeAltIcon } from './icons/HeroIcons'; 
import { API_BASE_URL } from '../constants'; 

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
  onUpdateProfilePicture: (imageFile: File) => void;
  tasks: Task[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  onNavigateToSettings: () => void;
  onNavigateToApp: () => void; 
}

export const Header: React.FC<HeaderProps> = ({
  user,
  onLogout,
  onUpdateProfilePicture,
  tasks,
  isDarkMode,
  toggleDarkMode,
  onNavigateToSettings,
  onNavigateToApp,
}) => {
  const { t, i18n } = useTranslation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const totalTasks = tasks.length;
  const inProgressTasks = tasks.filter(task => task.status === TaskStatus.IN_PROGRESS).length;
  const completedTasks = tasks.filter(task => task.completed).length;

  const isGuestUser = user?.id === 'guest';

  const handleProfilePictureClick = () => {
    if (isGuestUser) {
      return;
    }
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isGuestUser) return;
    const file = event.target.files?.[0];
    if (file) {
      onUpdateProfilePicture(file); 
    }
  };

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setLanguageDropdownOpen(false);
  };
  
  const getFullProfilePictureUrl = (relativeUrl?: string) => {
    if (!relativeUrl) return null;
    if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://') || relativeUrl.startsWith('data:')) {
        return relativeUrl;
    }
    return `${API_BASE_URL}${relativeUrl}`;
  }


  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-dark-card shadow-md backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <button 
          onClick={onNavigateToApp} 
          className="flex items-center transition-transform duration-300 ease-in-out hover:scale-105 hover:opacity-90" 
          aria-label={t('taskManager')}
        >
          <img src="/logo.png" alt={t('taskManager') || "Task Manager Logo"} className="h-10" />
        </button>

        {user && (
          <div className="hidden md:flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-300">
            <span>{t('totalTasks')}: <span className="font-semibold">{totalTasks}</span></span>
            <span>{t('inProgressTasks')}: <span className="font-semibold text-yellow-500">{inProgressTasks}</span></span>
            <span>{t('completedTasks')}: <span className="font-semibold text-green-500">{completedTasks}</span></span>
          </div>
        )}

        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="relative">
            <button
              onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
              aria-label={t('language')}
              aria-haspopup="true"
              aria-expanded={languageDropdownOpen}
            >
              <GlobeAltIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
            </button>
            {languageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-secondary-dark rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                <button
                  onClick={() => changeLanguage('en')}
                  className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'en' ? 'font-semibold text-primary dark:text-accent' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}
                >
                  {t('english')}
                </button>
                <button
                  onClick={() => changeLanguage('fa')}
                  className={`w-full text-left px-4 py-2 text-sm ${i18n.language === 'fa' ? 'font-semibold text-primary dark:text-accent' : 'text-gray-700 dark:text-gray-200'} hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150`}
                >
                  {t('persian')}
                </button>
              </div>
            )}
          </div>
          
          <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
            aria-label={isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')}
          >
            {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
          </button>
          
          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center space-x-2 p-1 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-105"
                aria-haspopup="true"
                aria-expanded={userDropdownOpen}
                aria-controls="user-menu"
              >
                <div 
                  onClick={!isGuestUser ? handleProfilePictureClick : undefined} 
                  className={`${!isGuestUser ? "cursor-pointer" : "cursor-default"} rounded-full transition-transform duration-200 hover:scale-105`}
                  role={!isGuestUser ? "button" : undefined}
                  aria-label={!isGuestUser ? t('changeProfilePicture') : undefined}
                  tabIndex={!isGuestUser ? 0 : -1}
                  onKeyDown={!isGuestUser ? (e) => e.key === 'Enter' && handleProfilePictureClick() : undefined}
                >
                  {user.profilePictureUrl ? (
                    <img src={getFullProfilePictureUrl(user.profilePictureUrl) || undefined} alt={t('profile') || 'Profile'} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <UserCircleIcon className="w-8 h-8 text-gray-700 dark:text-gray-300" />
                  )}
                </div>
                {!isGuestUser && (
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                    id="profilePictureInput"
                  />
                )}
                <span className="hidden sm:inline text-gray-700 dark:text-gray-300">{user.name}</span>
                <ChevronDownIcon className={`w-4 h-4 text-gray-700 dark:text-gray-300 transition-transform ${userDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              {userDropdownOpen && (
                <div id="user-menu" className="absolute right-0 mt-2 w-48 bg-white dark:bg-secondary-dark rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 animate-fadeIn">
                  <button onClick={() => { onNavigateToSettings(); setUserDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150">
                    <CogIcon className="w-5 h-5 mr-2" /> {t('settings')}
                  </button>
                  {user.isAdmin && !isGuestUser && (
                    <a href="#admin" onClick={(e) => {e.preventDefault(); window.open(`${API_BASE_URL}/admin/`, '_blank'); setUserDropdownOpen(false);}} className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150">
                      <ArrowUturnLeftIcon className="w-5 h-5 mr-2" /> {t('adminPanel')}
                    </a>
                  )}
                  <hr className="my-1 border-gray-200 dark:border-gray-600"/>
                  <button onClick={() => { onLogout(); setUserDropdownOpen(false); }} className="w-full text-left flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors duration-150">
                    <LogoutIcon className="w-5 h-5 mr-2" /> {t('logout')}
                  </button>
                </div>
              )}
            </div>
          ) : (
             <a
              href="#login" 
              onClick={(e) => { e.preventDefault(); /* App.tsx handles navigation */ }}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-md transition-all duration-200 hover:shadow-md hover:scale-105"
            >
              <SignInIcon className="w-5 h-5 mr-1" />
              {t('login')}
            </a>
          )}
        </div>
      </div>
    </header>
  );
};
