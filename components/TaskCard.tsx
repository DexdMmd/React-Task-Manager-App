
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskStatus, TaskCategory } from '../types';
import { TrashIcon, PencilIcon, CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, CalendarIcon, UserGroupIcon, TagIcon } from './icons/HeroIcons';
import { Modal } from './Modal';
import { TaskForm } from './TaskForm'; // For editing

interface TaskCardProps {
  task: Task;
  onDelete: (taskId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onUpdate: (task: Task) => void;
}

const formatDate = (dateString?: string, locale: string = 'en') => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleString(locale, {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  } catch (e) {
    return 'Invalid Date';
  }
};

const getStatusColor = (status: TaskStatus, completed: boolean) => {
  if (completed) return 'text-green-500 dark:text-green-400';
  switch (status) {
    case TaskStatus.TODO: return 'text-gray-500 dark:text-gray-400';
    case TaskStatus.IN_PROGRESS: return 'text-blue-500 dark:text-blue-400';
    case TaskStatus.DONE: return 'text-green-500 dark:text-green-400';
    case TaskStatus.BLOCKED: return 'text-red-500 dark:text-red-400';
    default: return 'text-gray-500 dark:text-gray-400';
  }
};

const getStatusIcon = (status: TaskStatus, completed: boolean) => {
  if (completed) return <CheckCircleIcon className="w-5 h-5 mr-1" />;
  switch (status) {
    case TaskStatus.IN_PROGRESS: return <InformationCircleIcon className="w-5 h-5 mr-1" />;
    case TaskStatus.BLOCKED: return <XCircleIcon className="w-5 h-5 mr-1" />;
    default: return <InformationCircleIcon className="w-5 h-5 mr-1" />; // Default for ToDo
  }
};


export const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onToggleComplete, onUpdate }) => {
  const { t, i18n } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const isUrgent = task.isUrgent || (task.endTime && new Date(task.endTime) < new Date() && !task.completed);

  const handleUpdateTask = (updatedTaskData: Omit<Task, 'id' | 'completed' | 'createdAt'>) => {
    onUpdate({ ...task, ...updatedTaskData });
    setIsEditing(false);
  };
  
  const currentLocale = i18n.language;

  return (
    <>
      <div className={`p-5 bg-white dark:bg-secondary-dark shadow-lg rounded-lg border-l-4 ${isUrgent ? 'border-red-500 dark:border-red-400' : 'border-primary dark:border-accent'} transition-all duration-300 ease-in-out hover:shadow-xl hover:-translate-y-1 transform`}>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1">{task.title}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">{task.description}</p>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setIsEditing(true)} className="p-1.5 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-all duration-200 transform hover:scale-110" title={t('editTask') || "Edit Task"}>
              <PencilIcon className="w-5 h-5" />
            </button>
            <button onClick={() => onDelete(task.id)} className="p-1.5 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-all duration-200 transform hover:scale-110" title={t('deleteTask') || "Delete Task"}>
              <TrashIcon className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm text-gray-500 dark:text-gray-400 mt-2">
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            {t('startTime')}: {formatDate(task.startTime, currentLocale)}
          </div>
          <div className="flex items-center">
            <CalendarIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            {t('endTime')}: {formatDate(task.endTime, currentLocale)}
          </div>
          <div className={`flex items-center ${getStatusColor(task.status, task.completed)}`}>
            {getStatusIcon(task.status, task.completed)} {t('status')}: {t(`status.${task.status.replace(/\s+/g, '').toLowerCase()}`, task.status)}
          </div>
           <div className="flex items-center">
            <TagIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
            {t('category')}: <span className="font-medium ml-1">{t(`category.${task.category.toLowerCase()}`, task.category)}</span>
          </div>
          <div className="flex items-center">
            {task.completed ? <CheckCircleIcon className="w-5 h-5 mr-1 text-green-500 dark:text-green-400" /> : <XCircleIcon className="w-5 h-5 mr-1 text-red-500 dark:text-red-400" />}
            {t('completed')}: {task.completed ? t('yes') : t('no')}
          </div>
          {task.assignedUsers && task.assignedUsers.length > 0 && (
            <div className="flex items-center">
              <UserGroupIcon className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-500" />
              {t('assignedUsers').split('(')[0].trim()}: {task.assignedUsers.join(', ')}
            </div>
          )}
        </div>
        
        {isUrgent && (
          <div className="mt-3 flex items-center text-red-500 dark:text-red-400 text-xs font-medium">
            <ExclamationTriangleIcon className="w-4 h-4 mr-1" />
            {t('urgent')}
          </div>
        )}

        <div className="mt-4 flex justify-end">
           <label 
            htmlFor={`complete-${task.id}`} 
            className="flex items-center cursor-pointer p-2 -m-2 rounded-md hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors duration-200"
          >
            <input
              type="checkbox"
              id={`complete-${task.id}`}
              checked={task.completed}
              onChange={() => onToggleComplete(task.id)}
              className="form-checkbox h-5 w-5 text-primary dark:text-accent rounded border-gray-300 dark:border-gray-600 focus:ring-primary dark:focus:ring-accent bg-gray-100 dark:bg-dark-input"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{task.completed ? t('markAsIncomplete') : t('markAsComplete')}</span>
          </label>
        </div>
         <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">{t('created')}: {formatDate(task.createdAt, currentLocale)}</p>
      </div>

      {isEditing && (
        <Modal isOpen={isEditing} onClose={() => setIsEditing(false)} title={t('editTask')}>
          <TaskForm
            onAddTask={handleUpdateTask}
            initialTask={{
                title: task.title,
                description: task.description,
                startTime: task.startTime ? new Date(task.startTime).toISOString().substring(0,16) : '', // Format for datetime-local
                endTime: task.endTime ? new Date(task.endTime).toISOString().substring(0,16) : '', // Format for datetime-local
                status: task.status,
                category: task.category,
                assignedUsers: task.assignedUsers
            }}
            isEditMode={true}
          />
        </Modal>
      )}
    </>
  );
};
