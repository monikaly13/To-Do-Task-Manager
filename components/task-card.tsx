'use client';

import { useState } from 'react';
import { Task } from '@/app/page';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { CheckCircle2, Circle, Trash2, Calendar, Tag, Pencil } from 'lucide-react';
import type { TaskCategory } from '@/lib/api';

const CATEGORIES: TaskCategory[] = ['Priority', 'Urgent', 'Important', 'Normal'];

interface TaskCardProps {
  task: Task;
  onDelete: (id: number) => void;
  onUpdateTask: (id: number, updates: Partial<Task>) => void;
}

export function TaskCard({ task, onDelete, onUpdateTask }: TaskCardProps) {
  const [editOpen, setEditOpen] = useState(false);
  const [editTitle, setEditTitle] = useState(task.title);
  const [editDesc, setEditDesc] = useState(task.description ?? '');
  const [editCategory, setEditCategory] = useState<TaskCategory>(
    (task.category as TaskCategory) || 'Normal'
  );
  const [editDueDate, setEditDueDate] = useState(() => {
    if (!task.dueDate) return '';
    const d = new Date(task.dueDate);
    return d.toISOString().slice(0, 10);
  });
  const [editDueTime, setEditDueTime] = useState(() => {
    if (!task.dueDate) return '';
    const d = new Date(task.dueDate);
    const h = d.getHours().toString().padStart(2, '0');
    const m = d.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  });

  const handleSaveEdit = () => {
    let dueDateStr: string | undefined;
    if (editDueDate) {
      dueDateStr = editDueTime ? `${editDueDate}T${editDueTime}:00` : `${editDueDate}T23:59:59`;
    }
    onUpdateTask(task.id, {
      title: editTitle.trim(),
      description: editDesc.trim(),
      category: editCategory,
      dueDate: dueDateStr,
    });
    setEditOpen(false);
  };

  const onUpdateStatus = (status: Task['status']) => onUpdateTask(task.id, { status });
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

  const getCategoryStyles = (category?: string) => {
    switch (category) {
      case 'Priority':
        return 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30';
      case 'Urgent':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/30';
      case 'Important':
        return 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30';
      case 'Normal':
      default:
        return 'bg-secondary/30 text-muted-foreground border border-border';
    }
  };

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

            {/* Edit & Delete */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Dialog open={editOpen} onOpenChange={(o) => { setEditOpen(o); if (!o) { setEditTitle(task.title); setEditDesc(task.description ?? ''); setEditCategory((task.category as TaskCategory) || 'Normal'); setEditDueDate(task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : ''); setEditDueTime(task.dueDate ? `${new Date(task.dueDate).getHours().toString().padStart(2, '0')}:${new Date(task.dueDate).getMinutes().toString().padStart(2, '0')}` : ''); } }}>
                <DialogTrigger asChild>
                  <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                    <Pencil className="w-4 h-4" />
                  </button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 pt-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Title</label>
                      <Input value={editTitle} onChange={(e) => setEditTitle(e.target.value)} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Description</label>
                      <textarea
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border text-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Category</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value as TaskCategory)}
                        className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border text-foreground"
                      >
                        {CATEGORIES.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium mb-2">Due Date</label>
                        <Input type="date" value={editDueDate} onChange={(e) => setEditDueDate(e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Time</label>
                        <Input type="time" value={editDueTime} onChange={(e) => setEditDueTime(e.target.value)} />
                      </div>
                    </div>
                    <Button onClick={handleSaveEdit} className="w-full">Save changes</Button>
                  </div>
                </DialogContent>
              </Dialog>
              <button
                onClick={() => onDelete(task.id)}
                className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
            {/* Category */}
            <div
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md ${getCategoryStyles(
                task.category
              )}`}
            >
              <Tag className="w-3 h-3" />
              <span>{task.category}</span>
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
