import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

export default function AdminAnalytics() {
  const { token, user } = useAuth();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    if (!token) return;
    if (user?.role !== 'ADMIN') return;
    api('/admin/analytics', {}, token).then(setData).catch(() => setData(null));
  }, [token, user]);

  if (!token) return <div>Please login.</div>;
  if (user?.role !== 'ADMIN') return <div>Admin only.</div>;
  if (!data) return <div>Loading...</div>;

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Users</h3>
          <p className="text-2xl">{data.users}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Orders</h3>
          <p className="text-2xl">{data.orders}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Bookings</h3>
          <p className="text-2xl">{data.bookings}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Reviews</h3>
          <p className="text-2xl">{data.reviews}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Payments</h3>
          <p className="text-2xl">{data.payments}</p>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold">Notifications</h3>
          <p className="text-2xl">{data.notifications}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">User Roles</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.userRoles}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
                label={({ role, count }) => `${role}: ${count}`}
              >
                {data.userRoles.map((entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-4">Order Statuses</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.orderStatuses}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-semibold mb-4">Recent Activity</h3>
        <ul className="space-y-2">
          {data.recentActivity.map((activity: any, index: number) => (
            <li key={index} className="flex justify-between">
              <span>{activity.type}</span>
              <span>{new Date(activity.created_at).toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white p-4 rounded shadow mt-6">
        <h3 className="font-semibold mb-4">Reviews and Feedback</h3>
        <p>Manage reviews and disputes here. (Mock: Total reviews: {data.reviews})</p>
        {/* Add review management UI here */}
      </div>

      <div className="bg-white p-4 rounded shadow mt-6">
        <h3 className="font-semibold mb-4">KYC and Verification</h3>
        <p>Monitor KYC status. (Mock: All users verified)</p>
        {/* Add KYC management UI here */}
      </div>
    </div>
  );
}
