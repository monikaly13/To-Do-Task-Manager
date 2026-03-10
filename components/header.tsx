'use client';

import { CheckCircle2, Circle, CircleDashed, CalendarCheck2, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/auth-context';

interface HeaderProps {
  stats: {
    total: number;
    todo: number;
    inProgress: number;
    done: number;
    completedThisMonth: number;
  };
}

export function Header({ stats }: HeaderProps) {
  const { username, logout } = useAuth();

  return (
    <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold tracking-tight text-foreground">Task Manager</h1>
              <p className="text-muted-foreground mt-2">
                Stay organized and track your progress
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">Hi, {username}</span>
              <Button variant="outline" size="sm" onClick={() => logout()}>
                <LogOut className="w-4 h-4 mr-2" />
                Log out
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-secondary/20 border border-border">
              <Circle className="w-5 h-5 text-primary" />
              <div>
                <p className="text-xs text-muted-foreground">Total Tasks</p>
                <p className="text-2xl font-semibold text-foreground">{stats.total}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/30">
              <CircleDashed className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div>
                <p className="text-xs text-muted-foreground">To Do</p>
                <p className="text-2xl font-semibold text-foreground">{stats.todo}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
              <Circle className="w-5 h-5 text-orange-600 dark:text-orange-400 fill-current" />
              <div>
                <p className="text-xs text-muted-foreground">In Progress</p>
                <p className="text-2xl font-semibold text-foreground">{stats.inProgress}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/30">
              <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-xs text-muted-foreground">Completed</p>
                <p className="text-2xl font-semibold text-foreground">{stats.done}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30">
              <CalendarCheck2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <div>
                <p className="text-xs text-muted-foreground">Completed (This Month)</p>
                <p className="text-2xl font-semibold text-foreground">{stats.completedThisMonth}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
