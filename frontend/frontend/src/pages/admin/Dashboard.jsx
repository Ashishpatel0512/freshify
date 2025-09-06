import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, BarChart, PieChart } from 'lucide-react';
import { Bar } from 'react-chartjs-2';
import api from '../../api/axios';

// Import Chart.js components
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    salesData: [],
  });

  useEffect(() => {
    api
      .get('/admin/dashboard')
      .then((res) => setStats(res.data))
      .catch((err) => console.error(err));
  }, []);

  const cards = [
    { title: 'Total Orders', value: stats.totalOrders, icon: <BarChart className="w-6 h-6 text-blue-500" />, bg: 'bg-blue-50' },
    { title: 'Total Revenue', value: `₹${stats.totalRevenue}`, icon: <PieChart className="w-6 h-6 text-green-500" />, bg: 'bg-green-50' },
    { title: 'Total Products', value: stats.totalProducts, icon: <Grid className="w-6 h-6 text-purple-500" />, bg: 'bg-purple-50' },
  ];

  const chartData = {
    labels: stats.salesData.map((item) => item.date),
    datasets: [
      {
        label: 'Daily Revenue',
        data: stats.salesData.map((item) => item.total),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Sales Overview' },
    },
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6">Admin Dashboard</h2>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        {cards.map((card, idx) => (
          <div
            key={idx}
            className={`flex items-center gap-4 p-5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 ${card.bg}`}
          >
            <div className="p-3 bg-white rounded-full shadow">{card.icon}</div>
            <div>
              <h3 className="font-semibold text-lg">{card.title}</h3>
              <p className="text-xl font-bold">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Link to="/admin/vegetables" className="flex items-center gap-4 p-5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-green-50">
          <div className="p-3 bg-white rounded-full shadow">
            <Grid className="w-6 h-6 text-green-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Manage Vegetables</h3>
            <p className="text-sm text-gray-500">Add / Edit / Delete products</p>
          </div>
        </Link>

        <Link to="/admin/orders" className="flex items-center gap-4 p-5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-blue-50">
          <div className="p-3 bg-white rounded-full shadow">
            <BarChart className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Manage Orders</h3>
            <p className="text-sm text-gray-500">Change status & download invoices</p>
          </div>
        </Link>

        <Link to="/admin/analytics" className="flex items-center gap-4 p-5 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 bg-purple-50">
          <div className="p-3 bg-white rounded-full shadow">
            <PieChart className="w-6 h-6 text-purple-500" />
          </div>
          <div>
            <h3 className="font-semibold text-lg">Analytics</h3>
            <p className="text-sm text-gray-500">Sales & order charts</p>
          </div>
        </Link>
      </div>

      {/* Sales Chart */}
      <div className="bg-white p-5 rounded-lg shadow-lg">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}
