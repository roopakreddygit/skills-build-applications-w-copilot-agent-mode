import { getJson } from '../api/client.js';
import { CapabilityCard } from './CapabilityCard.js';
import { useCapabilityData } from '../hooks/useCapabilityData.js';

export default function Activities() {
  const data = useCapabilityData<Record<string, unknown>>('/api/activities', 'activities', getJson);
  return <CapabilityCard title="Activities" description="Track student activity minutes and points." emptyMessage="No activities yet." {...data} />;
}
