import { useEffect, useState } from 'react';
import { api } from '../../lib/api';

export default function EquipmentPage() {
  const [items, setItems] = useState<any[]>([]);
  useEffect(() => { api('/equipment').then(setItems).catch(()=>setItems([])); }, []);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Equipment</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((it) => (
          <div key={it.id} className="p-4 bg-white rounded shadow">
            <div className="font-semibold">{it.name}</div>
            <div className="text-sm text-gray-600">{it.description}</div>
            <div className="mt-2">₹ {it.pricePerDay} / day</div>
          </div>
        ))}
      </div>
    </div>
  );
}
