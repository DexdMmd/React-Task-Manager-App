
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Task, TaskStatus, TaskCategory } from '../types';
import { ChartBarIcon, CheckBadgeIcon, ClockIcon, TagIcon, CalendarIcon } from './icons/HeroIcons';

interface DashboardProps {
  tasks: Task[];
}

const StatCard: React.FC<{ titleKey: string; value: string | number; icon: React.ReactNode; colorClass: string }> = ({ titleKey, value, icon, colorClass }) => {
  const { t } = useTranslation();
  return (
    <div className={`p-6 rounded-xl shadow-lg flex items-center space-x-4 bg-white dark:bg-dark-card border border-gray-200 dark:border-gray-700 ${colorClass} hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 ease-in-out`}>
      <div className="p-3 rounded-full bg-white/30 dark:bg-black/20">
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-100 dark:text-gray-300">{t(titleKey)}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );
};


export const Dashboard: React.FC<DashboardProps> = ({ tasks }) => {
  const { t } = useTranslation();
  const totalTasks = tasks.length;
  const completedTasksCount = tasks.filter(task => task.completed).length;
  const pendingTasksCount = totalTasks - completedTasksCount;
  
  const tasksDueThisWeek = tasks.filter(task => {
    if (!task.endTime || task.completed) return false;
    const dueDate = new Date(task.endTime);
    const today = new Date();
    const oneWeekFromToday = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 7);
    return dueDate >= today && dueDate <= oneWeekFromToday;
  }).length;

  const categoryCounts: Record<TaskCategory, number> = tasks.reduce((acc, task) => {
    acc[task.category] = (acc[task.category] || 0) + 1;
    return acc;
  }, {} as Record<TaskCategory, number>);
  
  const mostUsedCategoryEntry = Object.entries(categoryCounts).sort(([,a],[,b]) => b-a)[0];

  return (
    <div className="mb-8">
      <h2 className="text-3xl font-semibold mb-6 text-gray-700 dark:text-gray-100">{t('dashboard')}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          titleKey="totalTasks"
          value={totalTasks} 
          icon={<ChartBarIcon className="w-8 h-8" />}
          colorClass="bg-blue-500 dark:bg-blue-600"
        />
        <StatCard 
          titleKey="completedTasks"
          value={completedTasksCount} 
          icon={<CheckBadgeIcon className="w-8 h-8" />}
          colorClass="bg-green-500 dark:bg-green-600"
        />
        <StatCard 
          titleKey="pendingTasks"
          value={pendingTasksCount} 
          icon={<ClockIcon className="w-8 h-8" />}
          colorClass="bg-yellow-500 dark:bg-yellow-600"
        />
        <StatCard 
          titleKey="dueThisWeek"
          value={tasksDueThisWeek} 
          icon={<CalendarIcon className="w-8 h-8" />}
          colorClass="bg-purple-500 dark:bg-purple-600"
        />
      </div>
      <div className="mt-8 p-6 bg-white dark:bg-dark-card shadow-xl rounded-xl border border-gray-200 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-1 transform transition-all duration-300 ease-in-out">
        <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-100">{t('taskCategories')}</h3>
        {Object.keys(categoryCounts).length > 0 ? (
          <div className="space-y-3">
            {Object.entries(categoryCounts).map(([category, count]) => (
              <div key={category} className="flex justify-between items-center text-sm p-2 -m-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200">
                <span className="text-gray-600 dark:text-gray-300 flex items-center"><TagIcon className="w-4 h-4 mr-2 text-gray-400"/>{t(`category.${category.toLowerCase()}`, category)}</span>
                <div className="flex items-center">
                  <span className="font-semibold text-gray-700 dark:text-gray-200 mr-2">{count}</span>
                  <div className="w-32 h-3 bg-gray-200 dark:bg-gray-700 rounded-full">
                    <div 
                      className="h-3 bg-primary dark:bg-accent rounded-full" 
                      style={{ width: `${totalTasks > 0 ? (count / totalTasks) * 100 : 0}%`}}
                      title={`${totalTasks > 0 ? ((count / totalTasks) * 100).toFixed(1) : 0}%`}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
             <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              {t('mostUsedCategory')}: <span className="font-semibold">{mostUsedCategoryEntry ? t(`category.${mostUsedCategoryEntry[0].toLowerCase()}`, mostUsedCategoryEntry[0]) : 'N/A'}</span> ({mostUsedCategoryEntry ? mostUsedCategoryEntry[1] : 0} tasks)
            </p>
          </div>
        ) : (
          <p className="text-gray-500 dark:text-gray-400">{t('noTasksWithCategories')}</p>
        )}
      </div>
    </div>
  );
};
