
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskStatus, TaskCategory } from '../types';
import { TASK_STATUS_OPTIONS, TASK_CATEGORY_OPTIONS, DEFAULT_TASK_STATUS, DEFAULT_TASK_CATEGORY } from '../constants';
import { PlusCircleIcon, CalendarIcon } from './icons/HeroIcons';

interface TaskFormProps {
  onAddTask: (task: Omit<Task, 'id' | 'completed' | 'createdAt'>) => void;
  initialTask?: Omit<Task, 'id' | 'completed' | 'createdAt'>; // For editing
  isEditMode?: boolean;
}

export const TaskForm: React.FC<TaskFormProps> = ({ onAddTask, initialTask, isEditMode = false }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState(initialTask?.title || '');
  const [description, setDescription] = useState(initialTask?.description || '');
  const [startTime, setStartTime] = useState(initialTask?.startTime || '');
  const [endTime, setEndTime] = useState(initialTask?.endTime || '');
  const [status, setStatus] = useState<TaskStatus>(initialTask?.status || DEFAULT_TASK_STATUS);
  const [category, setCategory] = useState<TaskCategory>(initialTask?.category || DEFAULT_TASK_CATEGORY);
  const [assignedUsers, setAssignedUsers] = useState(initialTask?.assignedUsers?.join(', ') || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert(t("errorRequired")); 
      return;
    }
    onAddTask({
      title,
      description,
      startTime: startTime || undefined,
      endTime: endTime || undefined,
      status,
      category,
      assignedUsers: assignedUsers.split(',').map(u => u.trim()).filter(u => u),
    });
    if (!isEditMode) {
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setStatus(DEFAULT_TASK_STATUS);
      setCategory(DEFAULT_TASK_CATEGORY);
      setAssignedUsers('');
    }
  };
  
  const commonInputClass = "w-full p-3 bg-gray-100 dark:bg-dark-input border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary dark:focus:ring-accent focus:border-transparent outline-none transition-colors text-gray-700 dark:text-gray-200 placeholder-gray-400 dark:placeholder-gray-500 hover:border-gray-400 dark:hover:border-gray-500";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('title')} <span className="text-red-500">*</span></label>
        <input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={commonInputClass}
          placeholder={t('title') || "Title"}
          required
        />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('description')} <span className="text-red-500">*</span></label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${commonInputClass} h-24`}
          placeholder={t('description') || "Description"}
          required
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="startTime" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('startTime')}</label>
          <div className="relative">
            <input
              type="datetime-local"
              id="startTime"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className={commonInputClass}
            />
            <CalendarIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"/>
          </div>
        </div>
        <div>
          <label htmlFor="endTime" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('endTime')}</label>
           <div className="relative">
            <input
              type="datetime-local"
              id="endTime"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className={commonInputClass}
            />
            <CalendarIcon className="w-5 h-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 pointer-events-none"/>
          </div>
        </div>
      </div>
       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('status')}</label>
          <select id="status" value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={commonInputClass}>
            {TASK_STATUS_OPTIONS.map(opt => <option key={opt} value={opt}>{t(`status.${opt.replace(/\s+/g, '').toLowerCase()}`, opt)}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('category')}</label>
          <select id="category" value={category} onChange={(e) => setCategory(e.target.value as TaskCategory)} className={commonInputClass}>
            {TASK_CATEGORY_OPTIONS.map(opt => <option key={opt} value={opt}>{t(`category.${opt.toLowerCase()}`, opt)}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="assignedUsers" className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">{t('assignedUsers')}</label>
        <input
          type="text"
          id="assignedUsers"
          value={assignedUsers}
          onChange={(e) => setAssignedUsers(e.target.value)}
          className={commonInputClass}
          placeholder="e.g., user1, groupA"
        />
      </div>
      <button type="submit" className="w-full flex items-center justify-center p-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105">
        <PlusCircleIcon className="w-5 h-5 mr-2" />
        {isEditMode ? t('updateTaskButton') : t('addTaskButton')}
      </button>
    </form>
  );
};
