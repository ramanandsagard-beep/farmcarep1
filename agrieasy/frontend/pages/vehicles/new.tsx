import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function NewVehicle() {
  const { token, user } = useAuth();
  const [vehicleType, setVehicleType] = useState('Mini Truck');
  const [capacityKg, setCapacityKg] = useState(1000);
  const [plateNumber, setPlateNumber] = useState('');

  const create = async () => {
    if (!token) return alert('Login required');
    if (user?.role !== 'TRANSPORTER') return alert('Transporter role required');
    await api('/vehicles', { method: 'POST', body: JSON.stringify({ vehicleType, capacityKg, plateNumber }) }, token);
    alert('Vehicle added');
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Add Vehicle</h1>
      <input className="border p-2 w-full mb-3" placeholder="Vehicle Type" value={vehicleType} onChange={e=>setVehicleType(e.target.value)} />
      <input type="number" className="border p-2 w-full mb-3" placeholder="Capacity (kg)" value={capacityKg} onChange={e=>setCapacityKg(Number(e.target.value))} />
      <input className="border p-2 w-full mb-3" placeholder="Plate Number" value={plateNumber} onChange={e=>setPlateNumber(e.target.value)} />
      <button onClick={create} className="bg-agrigreen text-white px-4 py-2 rounded w-full">Create</button>
    </div>
  );
}
