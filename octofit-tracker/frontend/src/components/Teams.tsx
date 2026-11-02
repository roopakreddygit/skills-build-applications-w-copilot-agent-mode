import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';
import { useCapabilityData } from '../hooks/useCapabilityData.js';

const apiClient: typeof getJson = <T,>(path: string) => getJson<T>(path);

export default function Teams() {
  const data = useCapabilityData<Record<string, unknown>>('/api/teams', 'teams', apiClient);
  return <CapabilityCard title="Teams" description="Manage teams and members." emptyMessage="No teams yet." {...data} />;
}
