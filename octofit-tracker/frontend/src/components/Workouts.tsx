import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';
import { useCapabilityData } from '../hooks/useCapabilityData.js';

export default function Workouts() {
  const data = useCapabilityData<Record<string, unknown>>('/api/workouts/suggestions/mona%40example.com', 'suggestions', getJson);
  return <CapabilityCard title="Workout suggestions" description="Recommend workouts from activity patterns." emptyMessage="No workout suggestions yet." {...data} />;
}
