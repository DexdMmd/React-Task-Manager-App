
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { CheckCircleIcon, XCircleIcon, InformationCircleIcon } from './icons/HeroIcons';

interface NotificationProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

export const Notification: React.FC<NotificationProps> = ({ message, type, onClose }) => {
  const { t } = useTranslation();
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 5000); // Auto close after 5 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const baseClasses = "fixed top-20 right-4 md:right-8 p-4 rounded-lg shadow-xl text-white z-[200] animate-fadeIn flex items-center";
  let specificClasses = "";
  let IconComponent;

  switch (type) {
    case 'success':
      specificClasses = "bg-green-500";
      IconComponent = CheckCircleIcon;
      break;
    case 'error':
      specificClasses = "bg-red-500";
      IconComponent = XCircleIcon;
      break;
    case 'info':
    default:
      specificClasses = "bg-blue-500";
      IconComponent = InformationCircleIcon;
      break;
  }

  return (
    <div className={`${baseClasses} ${specificClasses}`}>
      {IconComponent && <IconComponent className="w-6 h-6 mr-3 flex-shrink-0" />}
      <span className="flex-grow">{message}</span> {/* Message is already translated in App.tsx */}
      <button onClick={onClose} className="ml-4 p-1 rounded-full hover:bg-white/20 transition-colors" aria-label={t('closeNotification') || "Close notification"}>
        <XCircleIcon className="w-5 h-5" />
      </button>
    </div>
  );
};