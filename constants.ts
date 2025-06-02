
import { TaskStatus, TaskCategory } from './types';

export const APP_NAME = 'React Task Manager';
export const API_BASE_URL = 'http://127.0.0.1:8000'; // Django backend URL

export const TASK_STATUS_OPTIONS = Object.values(TaskStatus);
export const TASK_CATEGORY_OPTIONS = Object.values(TaskCategory);

export const DEFAULT_TASK_STATUS = TaskStatus.TODO;
export const DEFAULT_TASK_CATEGORY = TaskCategory.PERSONAL;
