// NexusTracker Type Definitions

export type Priority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';
export type ProjectStatus = 'planning' | 'active' | 'on-hold' | 'completed' | 'archived';
export type ViewMode = 'kanban' | 'list' | 'calendar' | 'gantt';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  startDate: string;
  endDate?: string;
  progress: number;
  color: string;
  owner: User;
  members: User[];
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: User;
  reporter: User;
  dueDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  tags: string[];
  subtasks: Subtask[];
  attachments: Attachment[];
  comments: Comment[];
  dependencies: string[]; // Task IDs
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedBy: User;
  uploadedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt?: string;
}

export interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  hours: number;
  description?: string;
  date: string;
  createdAt: string;
}

export interface Activity {
  id: string;
  type: 'task_created' | 'task_updated' | 'task_completed' | 'comment_added' | 'member_added';
  user: User;
  projectId?: string;
  taskId?: string;
  description: string;
  timestamp: string;
}

export interface ProjectStats {
  totalTasks: number;
  completedTasks: number;
  inProgressTasks: number;
  overdueTasks: number;
  totalHours: number;
  teamMembers: number;
}

