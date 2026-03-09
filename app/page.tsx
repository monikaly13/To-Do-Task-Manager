'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '@/components/task-form';
import { TaskList } from '@/components/task-list';
import { TaskFilters } from '@/components/task-filters';
import { Header } from '@/components/header';
import { taskApi } from '@/lib/api';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  createdAt: string;
  dueDate?: string;
};

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Load tasks from API
  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    setLoading(true);
    const data = await taskApi.getAllTasks();
    setTasks(data);
    setLoading(false);
  };

  const handleAddTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = await taskApi.createTask(task);
    if (newTask) {
      setTasks([newTask, ...tasks]);
    }
  };

  const handleDeleteTask = async (id: number) => {
    const success = await taskApi.deleteTask(id);
    if (success) {
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };

  const handleUpdateTask = async (id: number, updates: Partial<Task>) => {
    const updated = await taskApi.updateTask(id, updates);
    if (updated) {
      setTasks(tasks.map((task) => (task.id === id ? updated : task)));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description.toLowerCase().includes(searchQuery.toLowerCase());
    return statusMatch && searchMatch;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <Header stats={stats} />
      <main className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading tasks...</p>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Form */}
            <div className="lg:col-span-1">
              <TaskForm onAddTask={handleAddTask} />
            </div>

            {/* Right Column - Tasks */}
            <div className="lg:col-span-2 space-y-6">
              <TaskFilters
                filterStatus={filterStatus}
                setFilterStatus={setFilterStatus}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
              />
              <TaskList
                tasks={filteredTasks}
                onDeleteTask={handleDeleteTask}
                onUpdateTask={handleUpdateTask}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
