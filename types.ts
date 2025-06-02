
export enum TaskStatus {
  TODO = 'To Do',
  IN_PROGRESS = 'In Progress',
  DONE = 'Done',
  BLOCKED = 'Blocked',
}

export enum TaskCategory {
  WORK = 'Work',
  PERSONAL = 'Personal',
  STUDY = 'Study',
  SHOPPING = 'Shopping',
  OTHER = 'Other',
}

export interface Task {
  id: string;
  title: string;
  description: string;
  startTime?: string; // ISO string
  endTime?: string; // ISO string
  status: TaskStatus;
  category: TaskCategory;
  completed: boolean;
  assignedUsers?: string[];
  createdAt: string; // ISO string
  isUrgent?: boolean; 
}

export interface User {
  id: string;
  name: string;
  email?: string; // Added for settings page
  isAdmin: boolean;
  profilePictureUrl?: string;
}

export interface NotificationType {
  message: string;
  type: 'success' | 'error' | 'info'; // Added 'info' type
  id?: string;
}
