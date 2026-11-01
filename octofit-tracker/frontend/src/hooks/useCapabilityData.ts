import { useEffect, useState } from 'react';
import { getJson } from '../api/client.js';

type CapabilityPayload = Record<string, unknown>;

export function useCapabilityData(path: string, dataKey: string) {
  const [items, setItems] = useState<unknown[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);

    getJson<CapabilityPayload>(path)
      .then((payload) => {
        const records = payload[dataKey];
        if (!Array.isArray(records)) throw new Error('The API returned an invalid response');
        if (active) setItems(records);
      })
      .catch((requestError: unknown) => {
        if (active) {
          const detail = requestError instanceof Error ? requestError.message : 'Unknown error';
          setError(detail);
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [path, dataKey]);

  return { items, loading, error };
}
