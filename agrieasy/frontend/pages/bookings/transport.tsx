import { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function TransportBookingPage() {
  const { token, user } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [vehicleId, setVehicleId] = useState('');
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [dropTime, setDropTime] = useState('');

  useEffect(() => { api('/vehicles').then(setVehicles).catch(()=>setVehicles([])); }, []);

  const create = async () => {
    if (!token) return alert('Login required');
    if (user?.role !== 'FARMER') return alert('Farmer role required');
    await api('/transport-bookings', { method: 'POST', body: JSON.stringify({ vehicleId, source, destination, pickupTime, dropTime }) }, token);
    alert('Transport booking requested');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Book Transport</h1>
      <select className="border p-2 w-full mb-3" value={vehicleId} onChange={e=>setVehicleId(e.target.value)}>
        <option value="">Select Vehicle</option>
        {vehicles.map(v => <option key={v.id} value={v.id}>{v.vehicleType} ({v.capacityKg}kg)</option>)}
      </select>
      <input className="border p-2 w-full mb-3" placeholder="Source" value={source} onChange={e=>setSource(e.target.value)} />
      <input className="border p-2 w-full mb-3" placeholder="Destination" value={destination} onChange={e=>setDestination(e.target.value)} />
      <label className="block text-sm mb-1">Pickup Time</label>
      <input type="datetime-local" className="border p-2 w-full mb-3" value={pickupTime} onChange={e=>setPickupTime(e.target.value)} />
      <label className="block text-sm mb-1">Drop Time</label>
      <input type="datetime-local" className="border p-2 w-full mb-3" value={dropTime} onChange={e=>setDropTime(e.target.value)} />
      <button onClick={create} className="bg-agrigreen text-white px-4 py-2 rounded w-full">Book</button>
    </div>
  );
}
