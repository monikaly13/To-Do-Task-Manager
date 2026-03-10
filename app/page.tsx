'use client';

import { useState, useEffect } from 'react';
import { TaskForm } from '@/components/task-form';
import { TaskList } from '@/components/task-list';
import { TaskFilters } from '@/components/task-filters';
import { Header } from '@/components/header';
import { AuthForm } from '@/components/auth-form';
import { taskApi } from '@/lib/api';
import { useAuth } from '@/context/auth-context';
import { CountdownTimer } from '@/components/countdown-timer';

export type Task = {
  id: number;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  category: string;
  createdAt: string;
  dueDate?: string;
  completedAt?: string;
};

export default function Home() {
  const { isLoggedIn, isLoading } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'todo' | 'in-progress' | 'done'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [completedThisMonth, setCompletedThisMonth] = useState(0);

  const sortTasksByDate = (items: Task[]) => {
    return [...items].sort((a, b) => {
      const aDue = a.dueDate ? new Date(a.dueDate).getTime() : Number.POSITIVE_INFINITY;
      const bDue = b.dueDate ? new Date(b.dueDate).getTime() : Number.POSITIVE_INFINITY;
      if (aDue !== bDue) return aDue - bDue; // earlier due dates first, no-due last

      const aCreated = a.createdAt ? new Date(a.createdAt).getTime() : 0;
      const bCreated = b.createdAt ? new Date(b.createdAt).getTime() : 0;
      return bCreated - aCreated; // newest created first as tie-breaker
    });
  };

  useEffect(() => {
    if (isLoggedIn) {
      loadTasks();
    } else {
      setLoading(false);
    }
  }, [isLoggedIn]);

  const loadTasks = async () => {
    setLoading(true);
    const data = await taskApi.getAllTasks();
    setTasks(sortTasksByDate(data));
    setLoading(false);
  };

  const loadCompletedThisMonth = async () => {
    try {
      const res = await fetch('/api/tasks/stats/completed-this-month', { credentials: 'include' });
      if (!res.ok) return;
      const count = await res.json();
      setCompletedThisMonth(Number(count) || 0);
    } catch {
      // ignore (non-critical stat)
    }
  };

  const handleAddTask = async (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask = await taskApi.createTask(task);
    if (newTask) {
      setTasks((prev) => sortTasksByDate([newTask, ...prev]));
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
      setTasks((prev) => sortTasksByDate(prev.map((task) => (task.id === id ? updated : task))));
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const statusMatch = filterStatus === 'all' || task.status === filterStatus;
    const searchMatch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    return statusMatch && searchMatch;
  });

  const stats = {
    total: tasks.length,
    todo: tasks.filter((t) => t.status === 'todo').length,
    inProgress: tasks.filter((t) => t.status === 'in-progress').length,
    done: tasks.filter((t) => t.status === 'done').length,
  };

  const nextDueTask = tasks
    .filter((t) => t.dueDate && t.status !== 'done')
    .map((t) => ({
      ...t,
      dueTime: new Date(t.dueDate as string).getTime(),
    }))
    .filter((t) => t.dueTime > Date.now())
    .sort((a, b) => a.dueTime - b.dueTime)[0];

  useEffect(() => {
    if (isLoggedIn) loadCompletedThisMonth();
  }, [isLoggedIn, tasks]);

  if (isLoading || !isLoggedIn) {
    if (isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/5">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading...</p>
          </div>
        </div>
      );
    }
    return <AuthForm />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/5">
      <Header stats={{ ...stats, completedThisMonth }} />
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
            <div className="lg:col-span-1">
              <TaskForm onAddTask={handleAddTask} />
            </div>
            <div className="lg:col-span-2 space-y-6">
              {nextDueTask && nextDueTask.dueDate && (
                <CountdownTimer
                  targetDate={nextDueTask.dueDate}
                  label={nextDueTask.title}
                />
              )}
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
