
import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { Header } from './components/Header';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Dashboard } from './components/Dashboard';
import { Notification } from './components/Notification';
import { LoginPage } from './components/LoginPage';
import { SettingsPage } from './components/SettingsPage';
import { NotFoundPage } from './components/NotFoundPage';
import { LoadingSpinner } from './components/LoadingSpinner';
import { Task, TaskStatus, User, NotificationType as AppNotificationType } from './types';
import { useDarkMode } from './hooks/useDarkMode';
import i18n from './i18n/config';
import { API_BASE_URL } from './constants';

const AUTH_TOKEN_KEY = 'taskManagerAuthToken';
const REFRESH_TOKEN_KEY = 'taskManagerRefreshToken';
const APP_USER_STORAGE_KEY = 'taskManagerUser';

type CurrentPage = 'login' | 'app' | 'settings' | 'notfound';

// Helper function to convert object keys to snake_case
const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);

const convertKeysToSnakeCase = (obj: any): any => {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(convertKeysToSnakeCase);
  }
  return Object.keys(obj).reduce((acc, key) => {
    // Do not convert keys that are already snake_case or simple (e.g. 'id', 'title')
    // This regex checks if there's a capital letter that's not at the start or preceded by another capital/number
    // or if it's a known camelCase key that needs conversion.
    // A simpler approach: always convert unless it's a very specific case.
    // For now, let's convert all keys that might be camelCase.
    let snakeKey = key;
    if (key.match(/([A-Z])/)) { // Basic check for camelCase
        snakeKey = toSnakeCase(key);
    }
    
    // Specific handling for 'completed' if backend expects 'is_completed'
    // However, if the frontend type uses 'completed' and backend uses 'completed', this is fine.
    // Let's assume backend uses 'completed' or 'is_urgent' directly from the snake_case conversion.
    // If 'completed' should become 'is_completed', we'd need a more specific mapping.
    // For this general fix, 'completed' will remain 'completed', 'isUrgent' will become 'is_urgent'.

    acc[snakeKey] = convertKeysToSnakeCase(obj[key]);
    return acc;
  }, {} as any);
};


const App: React.FC = () => {
  const { t } = useTranslation();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isDarkMode, toggleDarkModeTheme] = useDarkMode();
  const [notification, setNotification] = useState<AppNotificationType | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem(APP_USER_STORAGE_KEY);
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return !!localStorage.getItem(AUTH_TOKEN_KEY);
  });

  const [currentPage, setCurrentPage] = useState<CurrentPage>(() => {
    const path = window.location.pathname;
    if (path.includes('/settings')) return 'settings';
    return !!localStorage.getItem(AUTH_TOKEN_KEY) ? 'app' : 'login';
  });


  const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

  const showNotification = useCallback((message: string, type: AppNotificationType['type'], isTranslationKey = false, translationParams = {}) => {
    setNotification({ message: isTranslationKey ? t(message, translationParams) : message, type });
  }, [t, setNotification]);

  const genericGuestCheck = useCallback((actionKey: string): boolean => {
    if (user?.id === 'guest') {
      showNotification('guestActionRestriction.actionNotAllowed', 'info', true, { action: t(actionKey) });
      return true;
    }
    return false;
  }, [user, t, showNotification]);


  const fetchTasks = useCallback(async () => {
    if (!isAuthenticated) return;

    if (user?.id === 'guest') {
      setTasks([]); 
      showNotification('guestNotification.tasksNotSaved', 'info', true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const data = await response.json();
        setTasks(data);
      } else {
        showNotification('errorFetchingTasks', 'error', true);
        if (response.status === 401) handleLogout(false); 
      }
    } catch (error) {
      console.error("Fetch tasks error:", error);
      showNotification('errorNetwork', 'error', true);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user, showNotification]); 

  useEffect(() => {
    if (isAuthenticated) {
      fetchTasks();
    } else {
      setTasks([]); 
    }
  }, [isAuthenticated, fetchTasks]);


  useEffect(() => {
    const managePageNavigation = () => {
      const currentPath = window.location.pathname.substring(1); 
      if (!isAuthenticated && (currentPath === 'app' || currentPath === 'settings' || currentPath === '')) {
        setCurrentPage('login');
        window.history.pushState({}, '', '/login');
      } else if (isAuthenticated && (currentPath === 'login' || (currentPath === '' && currentPage === 'login'))) {
        setCurrentPage('app');
        window.history.pushState({}, '', '/app');
      } else if (currentPath && (currentPath === 'app' || currentPath === 'settings' || currentPath === 'login' || currentPath === 'notfound')) {
        setCurrentPage(currentPath as CurrentPage);
      } else if (isAuthenticated && currentPath === '') {
         setCurrentPage('app');
         window.history.pushState({}, '', '/app');
      } else if (!isAuthenticated && currentPath === '') {
         setCurrentPage('login');
         window.history.pushState({}, '', '/login');
      }
    };
  
    if (i18n.isInitialized) {
      managePageNavigation();
    } else {
        i18n.on('initialized', managePageNavigation);
    }

    const handlePopState = () => {
        const path = window.location.pathname.substring(1);
        if (path === 'app' || path === 'settings' || path === 'login' || path === 'notfound') {
            setCurrentPage(path as CurrentPage);
        } else if (path === '' && isAuthenticated) {
            setCurrentPage('app');
        } else if (path === '' && !isAuthenticated) {
            setCurrentPage('login');
        } else {
            setCurrentPage('notfound'); 
        }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);

  }, [isAuthenticated, currentPage, i18n.isInitialized]);


  const addTask = useCallback(async (taskData: Omit<Task, 'id' | 'completed' | 'createdAt' | 'owner'>) => {
    if (genericGuestCheck('guestAction.createTasks')) return;
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const snakeCaseTaskData = convertKeysToSnakeCase(taskData);
      const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(snakeCaseTaskData)
      });
      if (response.ok) {
        const newTask = await response.json();
        setTasks(prevTasks => [newTask, ...prevTasks]);
        showNotification('taskCreatedSuccess', 'success', true);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Error creating task.' }));
        console.error('Error creating task:', response.status, errorData);
        showNotification(errorData.detail || t('errorCreatingTask'), 'error', false);
      }
    } catch (error) {
      console.error("Add task network error:", error);
      showNotification('errorNetwork', 'error', true);
    } finally {
      setIsLoading(false);
    }
  }, [genericGuestCheck, showNotification, t]); 

  const deleteTask = useCallback(async (taskId: string) => {
    if (genericGuestCheck('guestAction.deleteTasks')) return;
    setIsLoading(true);
    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/tasks/${taskId}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
        showNotification('taskDeletedSuccess', 'success', true);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Error deleting task.' }));
        console.error('Error deleting task:', response.status, errorData);
        showNotification(errorData.detail || t('errorDeletingTask'), 'error', false);
      }
    } catch (error) {
      console.error("Delete task network error:", error);
      showNotification('errorNetwork', 'error', true);
    } finally {
      setIsLoading(false);
    }
  }, [genericGuestCheck, showNotification, t]); 
  
  const updateTask = useCallback(async (updatedTask: Task) => {
    if (genericGuestCheck('guestAction.updateTasks')) return;
    setIsLoading(true);
    try {
      const token = getAuthToken();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, createdAt, ...taskDataToUpdate } = updatedTask; 
      const snakeCaseTaskData = convertKeysToSnakeCase(taskDataToUpdate);

      const response = await fetch(`${API_BASE_URL}/api/tasks/${id}/`, {
        method: 'PUT', 
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(snakeCaseTaskData)
      });
      if (response.ok) {
        const savedTask = await response.json();
        setTasks(prevTasks => prevTasks.map(task => (task.id === savedTask.id ? savedTask : task)));
        showNotification('taskUpdatedFullSuccess', 'success', true);
      } else {
        const errorData = await response.json().catch(() => ({ detail: 'Error updating task.' }));
        console.error('Error updating task:', response.status, errorData);
        showNotification(errorData.detail || t('errorUpdatingTask'), 'error', false);
      }
    } catch (error) {
      console.error("Update task network error:", error);
      showNotification('errorNetwork', 'error', true);
    } finally {
      setIsLoading(false);
    }
  }, [genericGuestCheck, showNotification, t]); 

  const toggleTaskCompletion = useCallback(async (taskId: string) => {
    if (user?.id === 'guest') { 
        genericGuestCheck('guestAction.updateTasks'); 
        return; 
    }
    const taskToUpdate = tasks.find(task => task.id === taskId);
    if (!taskToUpdate) return;

    const updatedStatus = !taskToUpdate.completed ? TaskStatus.DONE : TaskStatus.TODO;
    const updatedData = { ...taskToUpdate, completed: !taskToUpdate.completed, status: updatedStatus };
    updateTask(updatedData);
  }, [tasks, updateTask, user, genericGuestCheck]);


  const handleUpdateProfilePicture = useCallback(async (imageFile: File) => {
    if (!user) return;
    if (genericGuestCheck('guestAction.updateProfilePicture')) return;
    
    setIsLoading(true);
    const formData = new FormData();
    formData.append('profile_picture', imageFile);

    try {
      const token = getAuthToken();
      const response = await fetch(`${API_BASE_URL}/api/profile/picture/`, {
        method: 'PATCH', 
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      if (response.ok) {
        const updatedUserResponse = await fetch(`${API_BASE_URL}/api/auth/user/`, {
             headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!updatedUserResponse.ok) throw new Error('Failed to fetch updated user details');
        const updatedUserDetails = await updatedUserResponse.json();

        setUser(prevUser => prevUser ? ({ ...prevUser, profilePictureUrl: updatedUserDetails.profile_picture_url }) : null);
        localStorage.setItem(APP_USER_STORAGE_KEY, JSON.stringify({ ...user, profilePictureUrl: updatedUserDetails.profile_picture_url }));
        showNotification('profilePictureUpdatedSuccess', 'success', true);
      } else {
        const errorData = await response.json().catch(() => ({detail: 'Error updating profile picture.'}));
        console.error("Profile picture update error:", errorData);
        showNotification(errorData.detail || t('errorUpdatingProfilePic'), 'error', false);
      }
    } catch (error) {
      console.error("Profile picture update fetch error:", error);
      showNotification('errorNetwork', 'error', true);
    } finally {
      setIsLoading(false);
    }
  }, [user, genericGuestCheck, showNotification, t]); 

  const handleLogin = useCallback(async (credentials: { emailOrUsername?: string; password?: string }) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: credentials.emailOrUsername, password: credentials.password }) 
      });
      if (response.ok) {
        const data = await response.json();
        localStorage.setItem(AUTH_TOKEN_KEY, data.access);
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh);
        const apiUser = data.user; 
        const appUser: User = {
            id: apiUser.id.toString(),
            name: apiUser.name, 
            email: apiUser.email,
            isAdmin: apiUser.is_staff, // Django uses is_staff for admin panel access
            profilePictureUrl: apiUser.profile_picture_url || undefined
        };
        setUser(appUser);
        localStorage.setItem(APP_USER_STORAGE_KEY, JSON.stringify(appUser));
        setIsAuthenticated(true);
        setCurrentPage('app');
        window.history.pushState({}, '', '/app');
        showNotification('loggedInSuccess', 'success', true);
      } else {
        const errorData = await response.json().catch(() => ({detail: 'Login failed.'}));
        showNotification(errorData.detail || t('loginFailed'), 'error', false);
      }
    } catch (error) {
      showNotification('errorNetwork', 'error', true);
    } finally {
      setIsLoading(false);
    }
  }, [showNotification, t]); 

  const handleGuestLogin = useCallback(() => {
    setIsLoading(true);
    const guestUser: User = {
      id: 'guest',
      name: t('guestUser'),
      email: 'guest@example.com',
      isAdmin: false,
      profilePictureUrl: undefined,
    };
    setUser(guestUser);
    localStorage.setItem(APP_USER_STORAGE_KEY, JSON.stringify(guestUser)); 
    setIsAuthenticated(true);
    setCurrentPage('app');
    window.history.pushState({}, '', '/app');
    showNotification('loggedInAsGuest', 'success', true);
    setIsLoading(false);
  }, [t, showNotification]); 

  const handleLogout = useCallback((notify = true) => {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    localStorage.removeItem(APP_USER_STORAGE_KEY);
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage('login');
    window.history.pushState({}, '', '/login');
    setTasks([]); 
    if (notify) showNotification('logout', 'info', true);
  }, [showNotification]); 


  const navigateTo = useCallback((page: CurrentPage) => {
    setCurrentPage(page);
    window.history.pushState({}, '', `/${page}`);
  }, []);


  const renderPage = () => {
    if (!isAuthenticated && currentPage !== 'login') {
      navigateTo('login'); 
      return <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
    }


    switch (currentPage) {
      case 'login':
        return <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />;
      case 'settings':
        return <SettingsPage user={user} onNavigateBack={() => navigateTo('app')} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkModeTheme} />;
      case 'notfound':
        return <NotFoundPage onNavigateHome={() => navigateTo('app')} />;
      case 'app':
      default: 
        return (
          <>
            <Dashboard tasks={tasks} />
            <div className="mt-8 grid grid-cols-1 xl:grid-cols-3 gap-6">
              <div className="xl:col-span-1 p-6 bg-white dark:bg-slate-800 shadow-xl rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t('addNewTask')}</h2>
                <TaskForm onAddTask={addTask} />
              </div>
              <div className="xl:col-span-2 p-6 bg-white dark:bg-slate-800 shadow-xl rounded-lg">
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">{t('yourTasks')}</h2>
                <TaskList tasks={tasks} onDeleteTask={deleteTask} onToggleComplete={toggleTaskCompletion} onUpdateTask={updateTask} />
              </div>
            </div>
          </>
        );
    }
  };
  
  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-slate-200 transition-colors duration-300`}>
      {isLoading && <LoadingSpinner />}
      {notification && <Notification message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
      
      {isAuthenticated && user && currentPage !== 'login' && ( 
        <Header
          user={user}
          onLogout={() => handleLogout()}
          onUpdateProfilePicture={handleUpdateProfilePicture}
          tasks={tasks}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkModeTheme}
          onNavigateToSettings={() => navigateTo('settings')}
          onNavigateToApp={() => navigateTo('app')}
        />
      )}
      
      <main className={`container mx-auto px-4 pb-8 ${isAuthenticated && currentPage !== 'login' ? 'pt-20 md:pt-24' : ''}`}>
        {renderPage()}
      </main>

      {currentPage === 'app' && (
         <footer className="text-center p-6 mt-auto text-sm text-gray-600 dark:text-slate-400 border-t border-gray-200 dark:border-slate-700">
          {t('taskManagerFooter.copyright', { year: new Date().getFullYear() })}
          <button 
            onClick={() => navigateTo('notfound')} 
            className="ml-4 text-blue-500 dark:text-blue-400 hover:underline"
          >
            {t('taskManagerFooter.test404')}
          </button>
        </footer>
      )}
    </div>
  );
};

export default App;
