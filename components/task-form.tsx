'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus } from 'lucide-react';

interface TaskFormProps {
  onAddTask: (task: {
    title: string;
    description: string;
    status: 'todo' | 'in-progress' | 'done';
    category: string;
    dueDate?: Date;
  }) => void;
}

const CATEGORIES = ['Design', 'Backend', 'Frontend', 'Documentation', 'Code Review', 'Testing'];

export function TaskForm({ onAddTask }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddTask({
      title: title.trim(),
      description: description.trim(),
      status: 'todo',
      category,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    });

    setTitle('');
    setDescription('');
    setCategory(CATEGORIES[0]);
    setDueDate('');
  };

  return (
    <div className="sticky top-24 space-y-4">
      <div className="bg-card border border-border rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-foreground mb-4">Create New Task</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Task Title
            </label>
            <Input
              placeholder="Enter task title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-secondary/30 border-border placeholder:text-muted-foreground"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Description
            </label>
            <textarea
              placeholder="Add task description..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-secondary/30 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Due Date (Optional)
            </label>
            <Input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="bg-secondary/30 border-border"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
            disabled={!title.trim()}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Task
          </Button>
        </form>
      </div>
    </div>
  );
}
