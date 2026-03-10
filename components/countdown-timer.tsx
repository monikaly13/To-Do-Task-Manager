'use client';

import { useEffect, useState } from 'react';

interface CountdownTimerProps {
  /** Target time to count down to (ISO string or Date) */
  targetDate: string | Date;
  /** Optional label to show what the timer is for (e.g. task title) */
  label?: string;
}

type TimeLeft = {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

const getTimeLeft = (target: Date): TimeLeft => {
  const totalMs = target.getTime() - Date.now();

  if (totalMs <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / (60 * 60 * 24));
  const hours = Math.floor((totalSeconds % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
  const seconds = totalSeconds % 60;

  return { days, hours, minutes, seconds };
};

export function CountdownTimer({ targetDate, label }: CountdownTimerProps) {
  const target = new Date(targetDate);
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft(target));

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(getTimeLeft(target));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  const isExpired =
    timeLeft.days === 0 &&
    timeLeft.hours === 0 &&
    timeLeft.minutes === 0 &&
    timeLeft.seconds === 0;

  const formatPart = (value: number, unit: string) =>
    value > 0 ? `${value}${unit}` : '';

  const parts = [
    formatPart(timeLeft.days, 'd'),
    formatPart(timeLeft.hours, 'h'),
    formatPart(timeLeft.minutes, 'm'),
    formatPart(timeLeft.seconds, 's'),
  ].filter(Boolean);

  const countdownText = parts.join(' ');

  if (Number.isNaN(target.getTime())) {
    return null;
  }

  return (
    <div className="mb-6 rounded-xl border bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-xs font-medium uppercase tracking-wide text-primary">
          Focus timer
        </div>
        {!isExpired ? (
          <div className="text-sm text-muted-foreground">
            You still have{' '}
            <span className="font-semibold text-foreground">
              {countdownText || 'less than a second'}
            </span>{' '}
            for this{label ? `: ${label}` : '.'}
          </div>
        ) : (
          <div className="text-sm font-medium text-destructive">
            Time is up for this{label ? `: ${label}` : ''}.
          </div>
        )}
      </div>
    </div>
  );
}

