import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { Order, OrderStatus } from '../../types';
import { CheckCircle2, Clock, ChefHat, Package, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '../../components/ui/Button';

export function OrderTracker() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchOrders();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchOrders, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.student.getOrders();
      setOrders(data);
      setError('');
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 1;
      case 'preparing':
        return 2;
      case 'ready':
        return 3;
      case 'completed':
        return 4;
      default:
        return 0;
    }
  };

  const steps = [
    { label: 'Order Placed', icon: Clock },
    { label: 'Preparing', icon: ChefHat },
    { label: 'Ready', icon: Package },
    { label: 'Completed', icon: CheckCircle2 },
  ];

  const activeOrders = orders.filter(
    (o) => o.status !== 'completed' && o.status !== 'cancelled'
  );
  
  const pastOrders = orders.filter(
    (o) => o.status === 'completed' || o.status === 'cancelled'
  );

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
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
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
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      {/* Active Orders */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Active Orders
        </h2>
        {activeOrders.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No active orders at the moment.
          </Card>
        ) : (
          <div className="space-y-6">
            {activeOrders.map((order) => {
              const currentStep = getStatusStep(order.status);
              return (
                <Card key={order.id} className="overflow-visible">
                  <div className="flex flex-col md:flex-row justify-between mb-6">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">
                        {order.food_court_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Order #{order.id}
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(order.created_at).toLocaleString()}
                      </p>
                    </div>
                    <div className="mt-2 md:mt-0 text-right">
                      <Badge variant={
                        order.status === 'pending' ? 'warning' :
                        order.status === 'preparing' ? 'info' :
                        'success'
                      }>
                        {order.status.toUpperCase()}
                      </Badge>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative mb-8">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                    <div
                      className="absolute top-1/2 left-0 h-1 bg-indigo-600 -translate-y-1/2 rounded-full transition-all duration-500"
                      style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                    />

                    <div className="relative flex justify-between">
                      {steps.map((step, index) => {
                        const isActive = index + 1 <= currentStep;
                        return (
                          <div key={step.label} className="flex flex-col items-center">
                            <div
                              className={`
                                w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-colors duration-300
                                ${isActive ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-gray-200 text-gray-300'}
                              `}
                            >
                              <step.icon className="w-4 h-4" />
                            </div>
                            <span
                              className={`
                                mt-2 text-xs font-medium transition-colors duration-300
                                ${isActive ? 'text-indigo-600' : 'text-gray-400'}
                              `}
                            >
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Order Items Summary */}
                  <div className="bg-gray-50 rounded-xl p-4">
                    <ul className="space-y-2">
                      {order.items.map((item) => (
                        <li key={item.id} className="flex justify-between text-sm">
                          <span className="text-gray-700">
                            <span className="font-medium">{item.quantity}x</span>{' '}
                            {item.menu_item_name}
                          </span>
                          <span className="text-gray-600">
                            ₹{(parseFloat(item.price) * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-bold text-gray-900">
                      <span>Total</span>
                      <span>₹{parseFloat(order.total_amount).toFixed(2)}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Past Orders */}
      <section>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Past Orders
        </h2>
        {pastOrders.length === 0 ? (
          <Card className="p-8 text-center text-gray-500">
            No past orders
          </Card>
        ) : (
          <div className="space-y-4">
            {pastOrders.map((order) => (
              <Card
                key={order.id}
                className="flex flex-col sm:flex-row justify-between items-center gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 bg-gray-100 rounded-xl flex items-center justify-center text-gray-500">
                    <Package className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">
                      {order.food_court_name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()} •{' '}
                      {order.items.length} items
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-bold text-gray-900">
                    ₹{parseFloat(order.total_amount).toFixed(2)}
                  </span>
                  <Badge
                    variant={order.status === 'completed' ? 'success' : 'error'}
                  >
                    {order.status}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
