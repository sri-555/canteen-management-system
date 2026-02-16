import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { Clock, CheckCircle2, ChefHat, RefreshCw } from 'lucide-react';

export function OrderQueue() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.admin.getOrders();
      setOrders(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (orderId: number, newStatus: OrderStatus) => {
    setUpdating(orderId);
    try {
      await api.admin.updateOrderStatus(orderId, newStatus);
      setOrders(
        orders.map((o) =>
          o.id === orderId ? { ...o, status: newStatus } : o
        )
      );
    } catch (err: any) {
      alert('Failed to update order: ' + err.message);
    } finally {
      setUpdating(null);
    }
  };

  const pendingOrders = orders.filter(
    (o) => o.status === 'pending' || o.status === 'preparing'
  );
  
  const completedOrders = orders.filter(
    (o) => o.status === 'ready' || o.status === 'completed'
  );

  const getStatusBadgeVariant = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'warning';
      case 'preparing':
        return 'info';
      case 'ready':
        return 'success';
      case 'completed':
        return 'neutral';
      default:
        return 'neutral';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Order Queue</h1>
        <Button
          variant="secondary"
          onClick={fetchOrders}
          disabled={loading}
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          Error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Active Orders Column */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <ChefHat className="w-5 h-5 mr-2 text-indigo-600" />
              Kitchen ({pendingOrders.length})
            </h2>
          </div>

          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <Card key={order.id} className="border-l-4 border-l-indigo-500">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {order.student_name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>

                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <ul className="space-y-1 text-sm">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex justify-between">
                        <span className="text-gray-700">
                          <span className="font-bold">{item.quantity}x</span>{' '}
                          {item.menu_item_name}
                        </span>
                        <span className="text-gray-500">
                          ₹{parseFloat(item.price).toFixed(2)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-2 pt-2 border-t border-gray-200 flex justify-between font-semibold">
                    <span>Total</span>
                    <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {order.status === 'pending' && (
                    <Button
                      className="w-full"
                      onClick={() => updateStatus(order.id, 'preparing')}
                      isLoading={updating === order.id}
                    >
                      Start Preparing
                    </Button>
                  )}
                  {order.status === 'preparing' && (
                    <Button
                      className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      onClick={() => updateStatus(order.id, 'ready')}
                      isLoading={updating === order.id}
                    >
                      Mark Ready
                    </Button>
                  )}
                </div>
              </Card>
            ))}
            {pendingOrders.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                No pending orders
              </div>
            )}
          </div>
        </section>

        {/* Ready/Completed Column */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <CheckCircle2 className="w-5 h-5 mr-2 text-green-600" />
              Ready / Completed ({completedOrders.length})
            </h2>
          </div>

          <div className="space-y-4">
            {completedOrders.map((order) => (
              <Card
                key={order.id}
                className={order.status === 'completed' ? 'opacity-60' : ''}
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Order #{order.id}
                    </h3>
                    <p className="text-sm text-gray-500">{order.student_name}</p>
                  </div>
                  <Badge variant={getStatusBadgeVariant(order.status)}>
                    {order.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-500 mb-3">
                  {order.items
                    .map((i) => `${i.quantity}x ${i.menu_item_name}`)
                    .join(', ')}
                </p>
                <p className="text-sm font-semibold text-gray-900 mb-3">
                  Total: ₹{parseFloat(order.total_amount).toFixed(2)}
                </p>
                {order.status === 'ready' && (
                  <Button
                    size="sm"
                    variant="secondary"
                    className="w-full"
                    onClick={() => updateStatus(order.id, 'completed')}
                    isLoading={updating === order.id}
                  >
                    Complete Order
                  </Button>
                )}
              </Card>
            ))}
            {completedOrders.length === 0 && (
              <div className="text-center py-12 text-gray-400 bg-white rounded-2xl border border-dashed border-gray-200">
                No completed orders
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
