
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Task } from '../types';
import { TaskCard } from './TaskCard';
import { DocumentMagnifyingGlassIcon } from './icons/HeroIcons';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (taskId: string) => void;
  onToggleComplete: (taskId:string) => void;
  onUpdateTask: (task: Task) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, onDeleteTask, onToggleComplete, onUpdateTask }) => {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-10">
        <DocumentMagnifyingGlassIcon className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-500 mb-4 transition-transform duration-300 hover:scale-110" />
        <p className="text-gray-500 dark:text-gray-400 text-lg">{t('noTasksYet')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {tasks.map(task => (
        <TaskCard 
          key={task.id} 
          task={task} 
          onDelete={onDeleteTask} 
          onToggleComplete={onToggleComplete}
          onUpdate={onUpdateTask}
        />
      ))}
    </div>
  );
};
