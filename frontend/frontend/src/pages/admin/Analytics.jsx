import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from 'recharts';

export default function Analytics() {
  const [data, setData] = useState([]);

  useEffect(() => {
    api
      .get('/admin/orders/analytics')
      .then((res) => {
        const map = res.data;
        setData([
          { name: 'Pending', value: map.Pending || 0 },
          { name: 'Processing', value: map.Processing || 0 },
          { name: 'Delivered', value: map.Delivered || 0 },
        ]);
      })
      .catch(() => {});
  }, []);

  const COLORS = ['#f59e0b', '#3b82f6', '#10b981'];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="bg-white shadow-lg rounded-lg p-6 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center">Order Analytics</h2>

        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
