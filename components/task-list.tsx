'use client';

import { Task } from '@/app/page';
import { TaskCard } from './task-card';
import { Empty } from '@/components/ui/empty';

interface TaskListProps {
  tasks: Task[];
  onDeleteTask: (id: number) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
}

export function TaskList({ tasks, onDeleteTask, onUpdateTask }: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <Empty
        icon="inbox"
        title="No tasks found"
        description="Create a new task to get started"
      />
    );
  }

  const isSameLocalDay = (a: Date, b: Date) =>
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();

  const now = new Date();
  const todayTasks = tasks.filter((t) => t.dueDate && isSameLocalDay(new Date(t.dueDate), now));
  const otherTasks = tasks.filter((t) => !t.dueDate || !isSameLocalDay(new Date(t.dueDate), now));

  return (
    <div className="space-y-6">
      {todayTasks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">To-Do-Soon</h2>
            <span className="text-xs text-muted-foreground">{todayTasks.length}</span>
          </div>
          <div className="space-y-3">
            {todayTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onUpdateTask={onUpdateTask}
              />
            ))}
          </div>
        </section>
      )}

      {otherTasks.length > 0 && (
        <section className="space-y-3">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-semibold text-foreground">
              {todayTasks.length > 0 ? 'All other tasks' : 'Tasks'}
            </h2>
            <span className="text-xs text-muted-foreground">{otherTasks.length}</span>
          </div>
          <div className="space-y-3">
            {otherTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onDelete={onDeleteTask}
                onUpdateTask={onUpdateTask}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
