import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';
import { useCapabilityData } from '../hooks/useCapabilityData.js';

export default function Leaderboard() {
  const data = useCapabilityData<Record<string, unknown>>('/api/leaderboard', 'leaderboard', getJson);
  return <CapabilityCard title="Leaderboard" description="Compare team point totals." emptyMessage="No leaderboard rankings yet." {...data} />;
}
