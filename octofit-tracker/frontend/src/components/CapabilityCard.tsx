import type { getJson } from '../api/client.js';
import { useCapabilityData } from '../hooks/useCapabilityData.js';

type Props = {
  title: string;
  description: string;
  endpoint: string;
  responseKey: string;
  emptyMessage: string;
  apiClient: typeof getJson;
};

function displayValue(value: unknown): string {
  if (Array.isArray(value)) return value.map(displayValue).join(', ');
  if (typeof value === 'object' && value !== null) return '';
  return String(value);
}

export function CapabilityCard({ title, description, endpoint, responseKey, emptyMessage, apiClient }: Props) {
  const { items, loading, error } = useCapabilityData<Record<string, unknown>>(endpoint, responseKey, apiClient);

  return (
    <section className="card h-100">
      <div className="card-body">
        <h2 className="h4">{title}</h2>
        <p>{description}</p>
        {loading ? <p role="status">Loading {title.toLowerCase()}...</p> : null}
        {error ? <p role="alert">{error}</p> : null}
        {!loading && !error && items.length === 0 ? <p>{emptyMessage}</p> : null}
        {!loading && !error && items.length > 0 ? (
          <ul className="list-group">
            {items.map((item, index) => {
              const labelKey = ['teamName', 'name', 'title', 'type'].find((key) => item[key] !== undefined);
              const label = (labelKey ? displayValue(item[labelKey]) : '') || `Item ${index + 1}`;
              return (
                <li className="list-group-item" key={String(item._id ?? `${label}-${index}`)}>
                  <h3 className="h6">{label}</h3>
                  <dl className="mb-0">
                    {Object.entries(item)
                      .filter(([key, value]) => key !== '_id' && key !== '__v' && key !== labelKey && value !== undefined && value !== null)
                      .map(([key, value]) => (
                        <div key={key} className="d-flex gap-2">
                          <dt>{key}</dt>
                          <dd>{displayValue(value)}</dd>
                        </div>
                      ))}
                  </dl>
                </li>
              );
            })}
          </ul>
        ) : null}
      </div>
    </section>
  );
}
