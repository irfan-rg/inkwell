/**
 * Use Database Keep-Alive Hook
 * 
 * Automatically pings the database when the app loads
 * Helps prevent cold starts for the first user
 */

import { useEffect, useState } from 'react';
import { pingDatabase } from '@/lib/supabase/keep-alive';

interface DatabaseStatus {
  isChecking: boolean;
  isAlive: boolean;
  isColdStart: boolean;
}

export function useDatabaseKeepAlive() {
  const [status, setStatus] = useState<DatabaseStatus>({
    isChecking: true,
    isAlive: false,
    isColdStart: false,
  });

  useEffect(() => {
    const checkDatabase = async () => {
      const startTime = Date.now();
      const isAlive = await pingDatabase();
      const responseTime = Date.now() - startTime;
      const isColdStart = responseTime > 5000;

      setStatus({
        isChecking: false,
        isAlive,
        isColdStart,
      });

      // Log cold start for debugging
      if (isColdStart) {
        console.log('Database cold start detected:', responseTime, 'ms');
      }
    };

    checkDatabase();
  }, []);

  return status;
}
