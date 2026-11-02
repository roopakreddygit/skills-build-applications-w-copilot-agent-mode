import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';
export default function Leaderboard() {
  return <CapabilityCard title="Leaderboard" description="Compare team point totals." endpoint="/api/leaderboard" responseKey="leaderboard" emptyMessage="No leaderboard rankings yet." apiClient={getJson} />;
}
