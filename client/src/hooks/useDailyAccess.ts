import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

interface DailyAccessData {
  lastAccessDate: string; // YYYY-MM-DD format
  currentDay: number;
  accessTime: string; // ISO timestamp
  completedToday: boolean;
}

interface UseDailyAccessReturn {
  currentDay: number;
  canAccessToday: boolean;
  timeUntilUnlock: number; // seconds until next day unlocks
  lastAccessDate: Date | null;
  resetDay: () => void;
  markDayCompleted: () => void;
  isDayCompleted: boolean;
}

export function useDailyAccess(): UseDailyAccessReturn {
  const [accessData, setAccessData] = useLocalStorage<DailyAccessData>('daily-access-control', {
    lastAccessDate: '',
    currentDay: 1,
    accessTime: '',
    completedToday: false
  });

  const [timeUntilUnlock, setTimeUntilUnlock] = useState<number>(0);

  // Get current date in YYYY-MM-DD format
  const getCurrentDateString = (): string => {
    const now = new Date();
    return now.toISOString().split('T')[0];
  };

  // Calculate seconds until next midnight
  const getSecondsUntilMidnight = (): number => {
    const now = new Date();
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(0, 0, 0, 0);
    
    return Math.floor((tomorrow.getTime() - now.getTime()) / 1000);
  };

  // Check if user can access today's challenge
  const canAccessToday = (): boolean => {
    const todayString = getCurrentDateString();
    const lastAccess = accessData.lastAccessDate;

    // First time access
    if (!lastAccess) {
      return true;
    }

    // Same day access
    if (lastAccess === todayString) {
      return true;
    }

    // Check if it's been at least one full day since last access
    const lastAccessDate = new Date(lastAccess);
    const today = new Date(todayString);
    const daysDifference = Math.floor((today.getTime() - lastAccessDate.getTime()) / (1000 * 60 * 60 * 24));

    return daysDifference >= 1;
  };

  // Update current day based on access pattern
  const updateCurrentDay = (): number => {
    const todayString = getCurrentDateString();
    const lastAccess = accessData.lastAccessDate;

    // First time access
    if (!lastAccess) {
      return 1;
    }

    // Same day access
    if (lastAccess === todayString) {
      return accessData.currentDay;
    }

    // New day - advance to next day
    const lastAccessDate = new Date(lastAccess);
    const today = new Date(todayString);
    const daysDifference = Math.floor((today.getTime() - lastAccessDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDifference >= 1) {
      return Math.min(accessData.currentDay + 1, 30); // Max 30 days
    }

    return accessData.currentDay;
  };

  // Mark today as accessed
  const markTodayAccessed = () => {
    const todayString = getCurrentDateString();
    const newCurrentDay = updateCurrentDay();

    setAccessData({
      ...accessData,
      lastAccessDate: todayString,
      currentDay: newCurrentDay,
      accessTime: new Date().toISOString(),
      completedToday: false // Reset completion status for new day
    });
  };

  // Mark current day as completed
  const markDayCompleted = () => {
    setAccessData({
      ...accessData,
      completedToday: true
    });
  };

  // Reset to day 1 (for testing or restart)
  const resetDay = () => {
    setAccessData({
      lastAccessDate: '',
      currentDay: 1,
      accessTime: '',
      completedToday: false
    });
  };

  // Update timer every second
  useEffect(() => {
    const updateTimer = () => {
      if (!canAccessToday()) {
        setTimeUntilUnlock(getSecondsUntilMidnight());
      } else {
        setTimeUntilUnlock(0);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [accessData.lastAccessDate]);

  // Mark today as accessed if user can access
  useEffect(() => {
    if (canAccessToday()) {
      const todayString = getCurrentDateString();
      if (accessData.lastAccessDate !== todayString) {
        markTodayAccessed();
      }
    }
  }, []);

  const lastAccessDate = accessData.lastAccessDate 
    ? new Date(accessData.lastAccessDate) 
    : null;

  return {
    currentDay: accessData.currentDay,
    canAccessToday: canAccessToday(),
    timeUntilUnlock,
    lastAccessDate,
    resetDay,
    markDayCompleted,
    isDayCompleted: accessData.completedToday
  };
}