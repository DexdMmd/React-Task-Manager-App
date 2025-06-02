
import React from 'react';
import { useTranslation } from 'react-i18next';
import { User } from '../types';
import { UserCircleIcon, SunIcon, MoonIcon, BellIcon, ShieldCheckIcon, ArrowUturnLeftIcon } from './icons/HeroIcons';

interface SettingsPageProps {
  user: User | null;
  onNavigateBack: () => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ user, onNavigateBack, isDarkMode, toggleDarkMode }) => {
  const { t } = useTranslation();

  const SettingItem: React.FC<{ titleKey: string; descriptionKey?: string; children?: React.ReactNode; onClick?: () => void; isButton?: boolean }> = 
    ({ titleKey, descriptionKey, children, onClick, isButton }) => (
    <div 
      className={`bg-white dark:bg-dark-card shadow rounded-lg p-6 ${onClick && isButton ? 'hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer hover:shadow-md transform hover:scale-[1.01] transition-all duration-200' : ''}`}
      onClick={onClick}
      role={onClick && isButton ? 'button' : undefined}
      tabIndex={onClick && isButton ? 0 : undefined}
      onKeyDown={onClick && isButton ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">{t(titleKey)}</h3>
      {descriptionKey && <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t(descriptionKey)}</p>}
      {children}
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t('settings')}</h2>
        <button
            onClick={onNavigateBack}
            className="flex items-center text-sm px-4 py-2 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
            aria-label={t('backToApp') || "Go back to app"}
        >
          <ArrowUturnLeftIcon className="w-5 h-5 mr-2"/>
          {t('backToApp', 'Back to App')}
        </button>
      </div>

      <div className="space-y-6">
        {/* Profile Information */}
        <SettingItem titleKey="profileInformation">
          <div className="flex items-center space-x-4">
            {user?.profilePictureUrl ? (
              <img src={user.profilePictureUrl} alt={t('profile') || "Profile"} className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <UserCircleIcon className="w-16 h-16 text-gray-400 dark:text-gray-500" />
            )}
            <div>
              <p className="text-xl font-medium text-gray-700 dark:text-gray-200">{user?.name || 'N/A'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email || t('noEmailProvided', 'No email provided')}</p>
              {user?.isAdmin && <span className="mt-1 inline-block px-2 py-0.5 text-xs font-semibold text-red-700 bg-red-100 dark:text-red-200 dark:bg-red-700 rounded-full">{t('admin', 'Admin')}</span>}
            </div>
          </div>
        </SettingItem>

        {/* Appearance Settings */}
        <SettingItem titleKey="appearanceSettings" descriptionKey="appearanceSettingsDescription">
          <div className="flex items-center justify-between">
            <span className="text-gray-700 dark:text-gray-300">{t('darkMode')}</span>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-200 transform hover:scale-110"
              aria-label={isDarkMode ? t('switchToLightMode') : t('switchToDarkMode')}
            >
              {isDarkMode ? <SunIcon className="w-6 h-6 text-yellow-400" /> : <MoonIcon className="w-6 h-6 text-gray-700" />}
            </button>
          </div>
        </SettingItem>

        {/* Notification Preferences (Placeholder) */}
        <SettingItem titleKey="notificationPreferences" descriptionKey="notificationPreferencesDescription" isButton={false}>
           <div className="flex items-center text-gray-400 dark:text-gray-500">
            <BellIcon className="w-5 h-5 mr-2"/>
            <span>{t('emailNotificationsPlaceholder', 'Email Notifications: On (Placeholder)')}</span>
          </div>
        </SettingItem>

        {/* Account Management (Placeholder) */}
         <SettingItem titleKey="accountManagement" descriptionKey="accountManagementDescription" isButton={false}>
          <div className="flex items-center text-gray-400 dark:text-gray-500">
            <ShieldCheckIcon className="w-5 h-5 mr-2"/>
             <span>{t('deleteAccountPlaceholder', 'Delete Account (Placeholder)')}</span>
          </div>
        </SettingItem>
      </div>
    </div>
  );
};
