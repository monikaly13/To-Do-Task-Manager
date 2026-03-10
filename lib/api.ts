export interface Task {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  createdAt: string;
  dueDate?: string;
}

export interface CreateTaskRequest {
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  dueDate?: string;
}

export type TaskCategory = 'Priority' | 'Urgent' | 'Important' | 'Normal';

export interface AuthResponse {
  success: boolean;
  message: string;
  userId?: number;
  username?: string;
}

const FETCH_OPTIONS: RequestInit = { credentials: 'include' };

const API_URL = '/api/tasks';
const AUTH_URL = '/api/auth';

export const authApi = {
  async login(username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${AUTH_URL}/login`, {
      ...FETCH_OPTIONS,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },
  async signup(username: string, password: string): Promise<AuthResponse> {
    const res = await fetch(`${AUTH_URL}/signup`, {
      ...FETCH_OPTIONS,
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },
  async logout(): Promise<AuthResponse> {
    const res = await fetch(`${AUTH_URL}/logout`, {
      ...FETCH_OPTIONS,
      method: 'POST',
    });
    return res.json();
  },
  async me(): Promise<AuthResponse> {
    const res = await fetch(`${AUTH_URL}/me`, FETCH_OPTIONS);
    return res.json();
  },
};

export const taskApi = {
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(API_URL, FETCH_OPTIONS);
      if (response.status === 401) return [];
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  async getTask(id: number): Promise<Task | null> {
    try {
      const response = await fetch(`${API_URL}/${id}`, FETCH_OPTIONS);
      if (!response.ok) throw new Error('Failed to fetch task');
      return await response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  },

  async createTask(task: CreateTaskRequest): Promise<Task | null> {
    try {
      const response = await fetch(API_URL, {
        ...FETCH_OPTIONS,
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  async updateTask(id: number, task: Partial<CreateTaskRequest>): Promise<Task | null> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        ...FETCH_OPTIONS,
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  async deleteTask(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        ...FETCH_OPTIONS,
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },
};
