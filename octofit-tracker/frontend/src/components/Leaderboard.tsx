import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';
import { useCapabilityData } from '../hooks/useCapabilityData.js';

const apiClient: typeof getJson = <T,>(path: string) => getJson<T>(path);

export default function Leaderboard() {
  const data = useCapabilityData<Record<string, unknown>>('/api/leaderboard', 'leaderboard', apiClient);
  return <CapabilityCard title="Leaderboard" description="Compare team point totals." emptyMessage="No leaderboard rankings yet." {...data} />;
}
