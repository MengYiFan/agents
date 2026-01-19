/**
 * useHomeConfig Hook
 *
 * 获取首页配置（集成服务 + 标签入口）
 */

import { useState, useEffect, useCallback } from 'react';
import { sectionService } from '@/services/sectionService';
import type { IHomeConfigResponse } from '@/types/section';

interface UseHomeConfigResult {
  config: IHomeConfigResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useHomeConfig(userName?: string, userEmail?: string): UseHomeConfigResult {
  const [config, setConfig] = useState<IHomeConfigResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchConfig = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await sectionService.getHomeConfig(userName, userEmail);
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch home config'));
    } finally {
      setLoading(false);
    }
  }, [userName, userEmail]);

  useEffect(() => {
    fetchConfig();
  }, [fetchConfig]);

  return { config, loading, error, refetch: fetchConfig };
}
