import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Modal } from '../../components/ui/Modal';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { MenuItem } from '../../types';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  AlertCircle,
  Upload,
  X,
} from 'lucide-react';

export function MenuManagement() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [foodCourtId, setFoodCourtId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [submitting, setSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [useUrlInput, setUseUrlInput] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image_url: '',
    is_available: true,
  });

  useEffect(() => {
    fetchFoodCourtAndMenu();
  }, []);

  const fetchFoodCourtAndMenu = async () => {
    try {
      // Get food court to get the ID
      const foodCourt = await api.admin.getFoodCourt() as any;
      setFoodCourtId(foodCourt.id);
      
      // Get menu items
      const items = await api.admin.getMenuItems() as MenuItem[];
      setMenuItems(items);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image_url: item.image_url || '',
      is_available: item.is_available,
    });
    setImagePreview(item.image_url || '');
    setUseUrlInput(!!item.image_url);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    const item = menuItems.find(i => i.id === id);
    if (!item) return;
    
    if (!confirm(`Are you sure you want to delete "${item.name}"? This action cannot be undone.`)) return;

    try {
      await api.admin.deleteMenuItem(id);
      setMenuItems(menuItems.filter((item) => item.id !== id));
      // Show success message
      const successMsg = document.createElement('div');
      successMsg.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
      successMsg.textContent = `"${item.name}" deleted successfully`;
      document.body.appendChild(successMsg);
      setTimeout(() => successMsg.remove(), 3000);
    } catch (err: any) {
      setError(err.message || 'Failed to delete item. Please try again.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!foodCourtId) return;

    setSubmitting(true);
    try {
      if (editingItem) {
        // Update existing item - only send changed fields
        const updateData: any = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          is_available: formData.is_available,
        };
        
        // Only include image_url if it's not empty
        if (formData.image_url && formData.image_url.trim() !== '') {
          updateData.image_url = formData.image_url;
        }
        
        const updated = await api.admin.updateMenuItem(editingItem.id, updateData) as MenuItem;
        setMenuItems(menuItems.map((item) => 
          item.id === editingItem.id ? updated : item
        ));
      } else {
        // Create new item
        const createData: any = {
          name: formData.name,
          description: formData.description,
          price: formData.price,
          category: formData.category,
          is_available: formData.is_available,
          food_court: foodCourtId,
        };
        
        // Only include image_url if it's not empty
        if (formData.image_url && formData.image_url.trim() !== '') {
          createData.image_url = formData.image_url;
        }
        
        const newItem = await api.admin.addMenuItem(createData) as MenuItem;
        setMenuItems([...menuItems, newItem]);
      }
      
      setIsModalOpen(false);
      resetForm();
    } catch (err: any) {
      alert('Failed to save item: ' + err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      image_url: '',
      is_available: true,
    });
    setEditingItem(null);
    setImagePreview('');
    setUseUrlInput(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setFormData({ ...formData, image_url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImagePreview('');
    setFormData({ ...formData, image_url: '' });
  };

  const filteredItems = menuItems.filter(
    (item) =>
      (item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterCategory === 'all' || item.category === filterCategory)
  );

  const categories = Array.from(new Set(menuItems.map((item) => item.category)));

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading menu...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Menu Management</h1>
        <Button
          onClick={() => {
            resetForm();
            setIsModalOpen(true);
          }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Item
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <Card noPadding>
        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search items..."
            icon={<Search className="w-4 h-4" />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md flex-1"
          />

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              className="block w-full rounded-xl border-gray-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-10"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100'}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-500 text-xs truncate max-w-[200px]">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    <Badge variant="neutral" className="bg-gray-100 text-gray-600 border-gray-200">
                      {item.category}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">
                    ₹{parseFloat(item.price).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant={item.is_available ? 'success' : 'neutral'}>
                      {item.is_available ? 'Available' : 'Unavailable'}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No items found
          </div>
        )}
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingItem ? 'Edit Item' : 'Add New Item'}
      >
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Image Upload Section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Item Image
            </label>
            
            {imagePreview ? (
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-xl border-2 border-gray-200"
                />
                <button
                  type="button"
                  onClick={removeImage}
                  className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {!useUrlInput ? (
                  <div>
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-500 hover:bg-indigo-50 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-10 h-10 text-gray-400 mb-3" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG, GIF up to 5MB</p>
                      </div>
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                    <button
                      type="button"
                      onClick={() => setUseUrlInput(true)}
                      className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      Or enter image URL instead
                    </button>
                  </div>
                ) : (
                  <div>
                    <Input
                      label=""
                      type="url"
                      value={formData.image_url}
                      onChange={(e) => {
                        setFormData({ ...formData, image_url: e.target.value });
                        setImagePreview(e.target.value);
                      }}
                      placeholder="https://example.com/image.jpg"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setUseUrlInput(false);
                        setFormData({ ...formData, image_url: '' });
                        setImagePreview('');
                      }}
                      className="text-sm text-indigo-600 hover:text-indigo-700 mt-2"
                    >
                      Upload file instead
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <Input
            label="Item Name"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <textarea
              className="block w-full rounded-xl border-gray-200 bg-white shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm h-24 resize-none"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (₹)"
              type="number"
              step="0.01"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            />

            <Input
              label="Category"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              placeholder="e.g., Fast Food, Beverages"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="available"
              className="rounded text-indigo-600 focus:ring-indigo-500"
              checked={formData.is_available}
              onChange={(e) => setFormData({ ...formData, is_available: e.target.checked })}
            />
            <label htmlFor="available" className="text-sm text-gray-700">
              Available for order
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" isLoading={submitting}>
              {editingItem ? 'Update Item' : 'Add Item'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
