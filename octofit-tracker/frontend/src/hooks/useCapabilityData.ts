import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type CapabilityState<T> = {
  items: T[];
  loading: boolean;
  error: string | null;
};

export function useCapabilityData<T>(endpoint: string, key: string) {
  const [state, setState] = useState<CapabilityState<T>>({
    items: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;

    getJson<Record<string, T[]>>(endpoint)
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
  }, [endpoint, key]);

  return state;
}
