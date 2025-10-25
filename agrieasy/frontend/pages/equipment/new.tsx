import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';

export default function NewEquipment() {
  const { token, user } = useAuth();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [pricePerDay, setPricePerDay] = useState(1000);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onload = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!image) return null;
    const formData = new FormData();
    formData.append('image', image);
    try {
      const res = await api('/equipment/upload-image', { method: 'POST', body: formData }, token);
      return res.imageUrl;
    } catch (e) {
      alert('Image upload failed');
      return null;
    }
  };

  const create = async () => {
    if (!token) return alert('Login required');
    if (user?.role !== 'EQUIPMENT_VENDOR') return alert('Vendor role required');
    setUploading(true);
    const imageUrl = await uploadImage();
    if (!imageUrl && image) {
      setUploading(false);
      return;
    }
    try {
      await api('/equipment', { method: 'POST', body: JSON.stringify({ name, description, pricePerDay, imageUrl }) }, token);
      alert('Equipment created');
      setName('');
      setDescription('');
      setPricePerDay(1000);
      setImage(null);
      setImagePreview(null);
    } catch (e) {
      alert('Failed to create equipment');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h1 className="text-xl font-semibold mb-4">Upload Equipment</h1>
      <input className="border p-2 w-full mb-3" placeholder="Name" value={name} onChange={e=>setName(e.target.value)} />
      <textarea className="border p-2 w-full mb-3" placeholder="Description" value={description} onChange={e=>setDescription(e.target.value)} />
      <input type="number" className="border p-2 w-full mb-3" placeholder="Price Per Day" value={pricePerDay} onChange={e=>setPricePerDay(Number(e.target.value))} />
      <input type="file" accept="image/*" className="border p-2 w-full mb-3" onChange={handleImageChange} />
      {imagePreview && <img src={imagePreview} alt="Preview" className="w-full h-48 object-cover mb-3 rounded" />}
      <button onClick={create} disabled={uploading} className={`px-4 py-2 rounded w-full ${uploading?'bg-gray-400':'bg-primary-green text-white'}`}>
        {uploading ? 'Creating...' : 'Create'}
      </button>
    </div>
  );
}
