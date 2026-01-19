/**
 * useTabContent Hook
 *
 * 获取当前激活标签页的楼层内容
 */

import { useState, useEffect, useCallback } from 'react';
import { sectionService } from '@/services/sectionService';
import type { ITabContentResponse } from '@/types/section';

interface UseTabContentResult {
  content: ITabContentResponse | null;
  loading: boolean;
  error: Error | null;
  refetch: () => void;
}

export function useTabContent(tabId: string | null): UseTabContentResult {
  const [content, setContent] = useState<ITabContentResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchContent = useCallback(async () => {
    if (!tabId) {
      setContent(null);

      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await sectionService.getTabContent(tabId);
      setContent(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch tab content'));
    } finally {
      setLoading(false);
    }
  }, [tabId]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return { content, loading, error, refetch: fetchContent };
}
