'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';

interface TaskFiltersProps {
  filterStatus: 'all' | 'todo' | 'in-progress' | 'done';
  setFilterStatus: (status: 'all' | 'todo' | 'in-progress' | 'done') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export function TaskFilters({
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
}: TaskFiltersProps) {
  const filters = [
    { key: 'all', label: 'All Tasks', color: 'bg-secondary/20 text-foreground border-border' },
    {
      key: 'todo',
      label: 'To Do',
      color: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/30',
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      color: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/30',
    },
    {
      key: 'done',
      label: 'Completed',
      color: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/30',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-card border-border placeholder:text-muted-foreground"
        />
      </div>

      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <Button
            key={filter.key}
            onClick={() => setFilterStatus(filter.key as any)}
            variant={filterStatus === filter.key ? 'default' : 'outline'}
            className={`transition-all ${
              filterStatus === filter.key
                ? 'bg-primary text-primary-foreground border-primary'
                : `${filter.color} border hover:bg-opacity-75`
            }`}
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
