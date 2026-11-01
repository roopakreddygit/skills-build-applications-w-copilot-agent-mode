import { useCapabilityData } from '../hooks/useCapabilityData.js';

type Props = {
  title: string;
  description: string;
  endpoint: string;
  dataKey: string;
  emptyMessage: string;
};

function displayValue(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (Array.isArray(value)) return value.map(displayValue).filter(Boolean).join(', ');
  if (typeof value === 'object') return Object.values(value).map(displayValue).filter(Boolean).join(', ');
  return String(value);
}

function itemTitleField(item: unknown): string | undefined {
  if (typeof item !== 'object' || item === null) return undefined;
  const record = item as Record<string, unknown>;
  for (const key of ['title', 'name', 'teamName', 'type']) {
    if (typeof record[key] === 'string' && record[key]) return key;
  }
  return undefined;
}

function itemTitle(item: unknown, index: number): string {
  if (typeof item !== 'object' || item === null) return displayValue(item) || `Item ${index + 1}`;
  const field = itemTitleField(item);
  return field ? String((item as Record<string, unknown>)[field]) : `Item ${index + 1}`;
}

export function CapabilityCard({ title, description, endpoint, dataKey, emptyMessage }: Props) {
  const { items, loading, error } = useCapabilityData(endpoint, dataKey);

  return <section className="card h-100">
    <div className="card-body">
      <h2 className="h4">{title}</h2>
      <p>{description}</p>
      {loading && <p role="status">Loading {title.toLowerCase()}…</p>}
      {!loading && error && <p role="alert">Unable to load {title.toLowerCase()}: {error}</p>}
      {!loading && !error && items.length === 0 && <p>{emptyMessage}</p>}
      {!loading && !error && items.length > 0 && <ul className="list-unstyled">
        {items.map((item, index) => <li className="mb-3" key={typeof item === 'object' && item !== null && '_id' in item ? String((item as { _id: unknown })._id) : `${itemTitle(item, index)}-${index}`}>
          <article>
            <h3 className="h5">{itemTitle(item, index)}</h3>
            {typeof item === 'object' && item !== null && <dl className="row mb-0">
              {Object.entries(item).filter(([key, value]) => key !== '_id' && key !== itemTitleField(item) && value !== null && value !== undefined).map(([key, value]) => <div className="col-sm-6" key={key}>
                <dt>{key.replace(/([A-Z])/g, ' $1').replace(/^./, (character) => character.toUpperCase())}</dt>
                <dd>{displayValue(value)}</dd>
              </div>)}
            </dl>}
          </article>
        </li>)}
      </ul>}
    </div>
  </section>;
}
