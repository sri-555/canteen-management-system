import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';
import { FoodCourt, MenuItem } from '../../types';
import { Plus, ArrowLeft, Clock, AlertCircle, ShoppingCart } from 'lucide-react';

export function FoodCourtMenu() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items, total, setIsOpen } = useCart();

  const [foodCourt, setFoodCourt] = useState<FoodCourt | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (id) {
      fetchFoodCourtMenu(parseInt(id));
    }
  }, [id]);

  const fetchFoodCourtMenu = async (courtId: number) => {
    try {
      const data = await api.student.getFoodCourtMenu(courtId);
      setFoodCourt(data);
      setMenuItems(data.menu_items || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (item: MenuItem) => {
    addToCart(item);
  };

  const handleCheckout = () => {
    setIsOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading menu...</div>
      </div>
    );
  }

  if (error || !foodCourt) {
    return (
      <div className="space-y-4">
        <Button variant="secondary" onClick={() => navigate('/student')}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Food Courts
        </Button>
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error || 'Food court not found'}
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));
  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter((item) => item.category === selectedCategory);

  return (
    <div className="space-y-8 pb-20">
      {/* Header with 3D effect */}
      <div className="relative bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-700 rounded-3xl overflow-hidden p-8 text-white transform transition-all duration-500 hover:shadow-2xl hover:scale-[1.02]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 animate-float"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2 animate-float" style={{ animationDelay: '2s' }}></div>

        <div className="relative z-10">
          <Button
            variant="secondary"
            onClick={() => navigate('/student')}
            className="mb-6 bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm transform transition-all duration-300 hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <h1 className="text-4xl font-bold mb-3 transform transition-all duration-300 hover:translate-x-2">{foodCourt.name}</h1>
          <p className="text-white/90 mb-6 text-lg">{foodCourt.description}</p>

          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm transform transition-all duration-300 hover:scale-105 hover:bg-white/20">
              <Clock className="w-4 h-4" />
              <span>Wait: {foodCourt.estimated_waiting_time} min</span>
            </div>
            <div className={`px-4 py-2 rounded-xl transform transition-all duration-300 hover:scale-105 ${foodCourt.is_open ? 'bg-green-500/20 backdrop-blur-sm' : 'bg-red-500/20 backdrop-blur-sm'}`}>
              {foodCourt.is_open ? '🟢 Open' : '🔴 Closed'}
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter with 3D effect */}
      <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold ${
            selectedCategory === 'all'
              ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200'
              : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200'
          }`}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 hover:shadow-lg font-semibold ${
              selectedCategory === category
                ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-200'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-md border border-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid with 3D effects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item, index) => (
          <Card
            key={item.id}
            className="overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2 group"
            style={{
              animationDelay: `${index * 50}ms`,
              boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
            }}
          >
            <div className="relative h-52 bg-gray-100 overflow-hidden">
              <img
                src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                alt={item.name}
                className="w-full h-full object-cover transform transition-all duration-700 group-hover:scale-110 group-hover:rotate-2"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {!item.is_available && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-red-500 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg transform transition-all duration-300 hover:scale-110">
                    Sold Out
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 bg-white">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-bold text-gray-900 text-lg group-hover:text-indigo-600 transition-colors duration-300">{item.name}</h3>
                <span className="text-xl font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl">
                  ₹{parseFloat(item.price).toFixed(2)}
                </span>
              </div>

              <p className="text-sm text-gray-600 mb-5 line-clamp-2">
                {item.description}
              </p>

              <Button
                className="w-full transform transition-all duration-300 hover:shadow-lg"
                onClick={() => handleAddToCart(item)}
                disabled={!item.is_available || !foodCourt.is_open}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add to Cart
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4 opacity-50">🍽️</div>
          <p className="text-lg">No items available in this category</p>
        </div>
      )}

      {/* Floating Cart Button with 3D effect */}
      {items.length > 0 && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce-slow">
          <Button
            size="lg"
            onClick={handleCheckout}
            className="shadow-2xl shadow-indigo-300/50 transform transition-all duration-300 hover:scale-110 hover:shadow-indigo-400/60 animate-pulse-glow"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({items.length}) • ₹{total.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
}
