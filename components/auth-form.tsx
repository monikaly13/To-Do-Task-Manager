'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/context/auth-context';
import { LogIn, UserPlus } from 'lucide-react';

export function AuthForm() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    setLoading(true);
    try {
      const res = mode === 'login'
        ? await login(username.trim(), password)
        : await signup(username.trim(), password);
      setMessage({
        type: res.success ? 'success' : 'error',
        text: res.message,
      });
      if (res.success) {
        setUsername('');
        setPassword('');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-secondary/5 p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground">To-Do-Soon</h1>
            <p className="text-muted-foreground mt-2">
              {mode === 'login' ? 'Sign in to track your tasks' : 'Create an account to get started'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Username</label>
              <Input
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-secondary/30 border-border"
                required
                minLength={mode === 'signup' ? 3 : 1}
                maxLength={50}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">Password</label>
              <Input
                type="password"
                placeholder={mode === 'signup' ? 'Min 6 characters' : 'Enter password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-secondary/30 border-border"
                required
                minLength={mode === 'signup' ? 6 : 1}
              />
            </div>

            {message && (
              <p
                className={`text-sm ${
                  message.type === 'error' ? 'text-destructive' : 'text-green-600 dark:text-green-400'
                }`}
              >
                {message.text}
              </p>
            )}

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading ? (
                <span className="animate-pulse">Please wait...</span>
              ) : mode === 'login' ? (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Log In
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Sign Up
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? (
              <>
                Don&apos;t have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setMessage(null);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setMessage(null);
                  }}
                  className="text-primary hover:underline font-medium"
                >
                  Log in
                </button>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
