'use client';

import { Task } from '@/app/page';
import { Button } from '@/components/ui/button';
import { CheckCircle2, Circle, Trash2, Calendar, Tag } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onUpdateStatus: (status: 'todo' | 'in-progress' | 'done') => void;
}

export function TaskCard({ task, onDelete, onUpdateStatus }: TaskCardProps) {
  const getStatusConfig = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return {
          icon: Circle,
          bg: 'bg-blue-500/10',
          border: 'border-blue-500/30',
          text: 'text-blue-600 dark:text-blue-400',
          label: 'To Do',
        };
      case 'in-progress':
        return {
          icon: Circle,
          bg: 'bg-orange-500/10',
          border: 'border-orange-500/30',
          text: 'text-orange-600 dark:text-orange-400',
          label: 'In Progress',
        };
      case 'done':
        return {
          icon: CheckCircle2,
          bg: 'bg-green-500/10',
          border: 'border-green-500/30',
          text: 'text-green-600 dark:text-green-400',
          label: 'Completed',
        };
    }
  };

  const statusConfig = getStatusConfig(task.status);
  const StatusIcon = statusConfig.icon;

  const getNextStatus = (current: Task['status']): Task['status'] => {
    switch (current) {
      case 'todo':
        return 'in-progress';
      case 'in-progress':
        return 'done';
      case 'done':
        return 'todo';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'done';

  return (
    <div
      className={`group p-4 rounded-lg border transition-all hover:shadow-md ${
        statusConfig.bg
      } ${statusConfig.border} bg-card border-border`}
    >
      <div className="flex items-start gap-3">
        {/* Status Icon */}
        <button
          onClick={() => onUpdateStatus(getNextStatus(task.status))}
          className="flex-shrink-0 mt-1 p-1.5 hover:bg-secondary/50 rounded-lg transition-colors"
          title={`Click to mark as ${getNextStatus(task.status)}`}
        >
          <StatusIcon className={`w-5 h-5 ${statusConfig.text}`} />
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <h3
                className={`font-semibold text-foreground leading-tight ${
                  task.status === 'done' ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {task.title}
              </h3>
              {task.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(task.id)}
              className="flex-shrink-0 p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            {/* Category */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-secondary/30 rounded-md">
              <Tag className="w-3 h-3 text-muted-foreground" />
              <span className="text-muted-foreground">{task.category}</span>
            </div>

            {/* Due Date */}
            {task.dueDate && (
              <div
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${
                  isOverdue
                    ? 'bg-destructive/10 text-destructive'
                    : 'bg-secondary/30 text-muted-foreground'
                }`}
              >
                <Calendar className="w-3 h-3" />
                <span>{formatDate(task.dueDate)}</span>
                {isOverdue && <span className="ml-1">Overdue</span>}
              </div>
            )}

            {/* Status Badge */}
            <div
              className={`px-2.5 py-1 rounded-md font-medium ${statusConfig.bg} ${statusConfig.text}`}
            >
              {statusConfig.label}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
