import { useEffect, useState } from 'react';
import type { getJson } from '../api/client.js';

type CapabilityState<T> = {
  items: T[];
  loading: boolean;
  error: string | null;
};

export function useCapabilityData<T>(endpoint: string, key: string, apiClient: typeof getJson) {
  const [state, setState] = useState<CapabilityState<T>>({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    apiClient<Record<string, T[]>>(endpoint)
      .then((response) => {
        const items = response[key];
        if (!Array.isArray(items)) throw new Error('Invalid API response');
        if (active) setState({ items, loading: false, error: null });
      })
      .catch(() => {
        if (active) setState({ items: [], loading: false, error: 'Unable to load data. Please try again.' });
      });

    return () => {
      active = false;
    };
  }, [apiClient, endpoint, key]);

  return state;
}
