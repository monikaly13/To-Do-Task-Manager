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

const API_URL = '/api/tasks';

export const taskApi = {
  // Get all tasks
  async getAllTasks(): Promise<Task[]> {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error('Failed to fetch tasks');
      return await response.json();
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  },

  // Get single task
  async getTask(id: number): Promise<Task | null> {
    try {
      const response = await fetch(`${API_URL}/${id}`);
      if (!response.ok) throw new Error('Failed to fetch task');
      return await response.json();
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  },

  // Create task
  async createTask(task: CreateTaskRequest): Promise<Task | null> {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to create task');
      return await response.json();
    } catch (error) {
      console.error('Error creating task:', error);
      return null;
    }
  },

  // Update task
  async updateTask(id: number, task: Partial<CreateTaskRequest>): Promise<Task | null> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      if (!response.ok) throw new Error('Failed to update task');
      return await response.json();
    } catch (error) {
      console.error('Error updating task:', error);
      return null;
    }
  },

  // Delete task
  async deleteTask(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
      });
      return response.ok;
    } catch (error) {
      console.error('Error deleting task:', error);
      return false;
    }
  },
};
