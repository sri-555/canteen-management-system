import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import api from '../../services/api';
import { AdminAnalytics } from '../../types';
import { DollarSign, ShoppingBag, TrendingUp, Clock } from 'lucide-react';

export function AdminDashboard() {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const data = await api.admin.getAnalytics();
      setAnalytics(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today's Revenue
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                ₹{parseFloat(analytics?.revenue_today || '0').toFixed(2)}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-green-50 text-green-600">
              <DollarSign className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Today's Orders
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics?.total_orders_today || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-blue-50 text-blue-600">
              <ShoppingBag className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Best Seller
              </p>
              <p className="text-lg font-bold text-gray-900 mt-1 truncate">
                {analytics?.most_selling_item || 'N/A'}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-purple-50 text-purple-600">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Units Sold
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {analytics?.most_selling_quantity || 0}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-indigo-50 text-indigo-600">
              <Clock className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button
            onClick={() => window.location.href = '/admin/menu'}
            className="p-4 text-left border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <h4 className="font-semibold text-gray-900">Manage Menu</h4>
            <p className="text-sm text-gray-500 mt-1">Add, edit, or remove items</p>
          </button>
          
          <button
            onClick={() => window.location.href = '/admin/orders'}
            className="p-4 text-left border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <h4 className="font-semibold text-gray-900">View Orders</h4>
            <p className="text-sm text-gray-500 mt-1">Manage incoming orders</p>
          </button>
          
          <button
            onClick={fetchAnalytics}
            className="p-4 text-left border border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 transition-all"
          >
            <h4 className="font-semibold text-gray-900">Refresh Data</h4>
            <p className="text-sm text-gray-500 mt-1">Update analytics</p>
          </button>
        </div>
      </Card>
    </div>
  );
}
