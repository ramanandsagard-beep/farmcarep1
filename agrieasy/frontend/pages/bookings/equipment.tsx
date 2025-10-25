import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function EquipmentBookingPage() {
  const { token, user } = useAuth();
  const [equipment, setEquipment] = useState<any[]>([]);
  const [equipmentId, setEquipmentId] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  useEffect(() => { api('/equipment').then(setEquipment).catch(()=>setEquipment([])); }, []);

  const create = async () => {
    if (!token) return alert('Login required');
    if (user?.role !== 'FARMER') return alert('Farmer role required');
    await api('/equipment-bookings', { method: 'POST', body: JSON.stringify({ equipmentId, startTime, endTime }) }, token);
    alert('Equipment booking requested');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Book Equipment</h1>
      <select className="border p-2 w-full mb-3" value={equipmentId} onChange={e=>setEquipmentId(e.target.value)}>
        <option value="">Select Equipment</option>
        {equipment.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
      </select>
      <label className="block text-sm mb-1">Start Time</label>
      <input type="datetime-local" className="border p-2 w-full mb-3" value={startTime} onChange={e=>setStartTime(e.target.value)} />
      <label className="block text-sm mb-1">End Time</label>
      <input type="datetime-local" className="border p-2 w-full mb-3" value={endTime} onChange={e=>setEndTime(e.target.value)} />
      <button onClick={create} className="bg-agrigreen text-white px-4 py-2 rounded w-full">Book</button>
    </div>
  );
}
