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
      {/* Header */}
      <div className="relative bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl overflow-hidden p-8 text-white">
        <Button
          variant="secondary"
          onClick={() => navigate('/student')}
          className="mb-4 bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
        
        <h1 className="text-3xl font-bold mb-2">{foodCourt.name}</h1>
        <p className="text-white/80 mb-4">{foodCourt.description}</p>
        
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-lg backdrop-blur-sm">
            <Clock className="w-4 h-4" />
            <span>Wait: {foodCourt.estimated_waiting_time} min</span>
          </div>
          <div className={`px-3 py-1.5 rounded-lg ${foodCourt.is_open ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
            {foodCourt.is_open ? '🟢 Open' : '🔴 Closed'}
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
            selectedCategory === 'all'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
        >
          All Items
        </button>
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              selectedCategory === category
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="relative h-48 bg-gray-100">
              <img
                src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'}
                alt={item.name}
                className="w-full h-full object-cover"
              />
              {!item.is_available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="bg-red-500 text-white px-4 py-2 rounded-lg font-semibold">
                    Sold Out
                  </span>
                </div>
              )}
            </div>
            
            <div className="p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-900">{item.name}</h3>
                <span className="text-lg font-bold text-indigo-600">
                  ₹{parseFloat(item.price).toFixed(2)}
                </span>
              </div>
              
              <p className="text-sm text-gray-500 mb-4 line-clamp-2">
                {item.description}
              </p>
              
              <Button
                className="w-full"
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
        <div className="text-center py-12 text-gray-400">
          No items available in this category
        </div>
      )}

      {/* Floating Cart Button */}
      {items.length > 0 && (
        <div className="fixed bottom-6 right-6 z-50">
          <Button
            size="lg"
            onClick={handleCheckout}
            className="shadow-xl"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            View Cart ({items.length}) • ₹{total.toFixed(2)}
          </Button>
        </div>
      )}
    </div>
  );
}
