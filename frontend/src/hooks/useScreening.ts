'use client';
import { useEffect, useState, useCallback } from 'react';
import { ScreeningResult } from '@/types/candidate';
import { getResults } from '@/lib/api';

export function useScreening(jobId: string) {
  const [results, setResults] = useState<ScreeningResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const data = await getResults(jobId);
      setResults(data);
      setError(null);
    } catch (err: any) {
      if (err?.response?.status === 404) {
        setResults([]);
        setError(null);
      } else {
        setError('Failed to load screening results');
      }
    } finally {
      setLoading(false);
    }
  }, [jobId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { results, loading, error, refetch: fetch };
}
