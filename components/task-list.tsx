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

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          onDelete={onDeleteTask}
          onUpdateTask={onUpdateTask}
        />
      ))}
    </div>
  );
}
