import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Badge } from '../../components/ui/Badge';
import { Modal } from '../../components/ui/Modal';
import { User, Edit2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../services/api';

interface FoodCourt {
  id: number;
  name: string;
  description: string;
  admin: {
    id: number;
    username: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  is_open: boolean;
  estimated_waiting_time: number;
}

interface AdminUser {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
}

export function FoodCourtManagement() {
  const [foodCourts, setFoodCourts] = useState<FoodCourt[]>([]);
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourt, setSelectedCourt] = useState<FoodCourt | null>(null);
  const [selectedAdminId, setSelectedAdminId] = useState<number | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [courtsData, usersData] = await Promise.all([
        api.superAdmin.getAllFoodCourts(),
        api.superAdmin.getAllUsers()
      ]);
      
      setFoodCourts(courtsData as FoodCourt[]);
      
      // Filter only food court admins
      const foodCourtAdmins = (usersData as AdminUser[]).filter(
        (user: AdminUser) => user.role === 'food_court_admin'
      );
      setAdmins(foodCourtAdmins);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (court: FoodCourt) => {
    setSelectedCourt(court);
    setSelectedAdminId(court.admin.id);
    setIsModalOpen(true);
    setError('');
  };

  const handleUpdateAdmin = async () => {
    if (!selectedCourt || !selectedAdminId) return;
    
    setIsUpdating(true);
    setError('');
    
    try {
      await api.superAdmin.updateFoodCourtAdmin(selectedCourt.id, selectedAdminId);
      
      // Refresh data
      await fetchData();
      setIsModalOpen(false);
      setSelectedCourt(null);
      setSelectedAdminId(null);
    } catch (err: any) {
      setError(err.message || 'Failed to update admin');
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading food courts...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Food Court Management
        </h1>
      </div>

      {error && !isModalOpen && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700">
          <AlertCircle className="w-5 h-5 mr-2" />
          {error}
        </div>
      )}

      <Card noPadding className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Admin
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Wait Time
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              <AnimatePresence>
                {foodCourts.map((court, index) => (
                  <motion.tr
                    key={court.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-bold text-lg">
                          {court.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {court.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-xs truncate">
                        {court.description}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <User className="w-4 h-4 mr-1.5 text-gray-400" />
                        <div>
                          <div className="font-medium text-gray-900">
                            {court.admin.first_name} {court.admin.last_name}
                          </div>
                          <div className="text-xs text-gray-400">
                            {court.admin.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={court.is_open ? 'success' : 'neutral'}>
                        {court.is_open ? 'Open' : 'Closed'}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {court.estimated_waiting_time} min
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenModal(court)}
                        title="Change Admin"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </Button>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </Card>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Change Admin for ${selectedCourt?.name}`}
      >
        <div className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select New Admin
            </label>
            <select
              className="block w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              value={selectedAdminId || ''}
              onChange={(e) => setSelectedAdminId(Number(e.target.value))}
            >
              <option value="">Select an admin...</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.first_name} {admin.last_name} ({admin.email})
                </option>
              ))}
            </select>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm text-blue-700">
            <strong>Current Admin:</strong> {selectedCourt?.admin.first_name}{' '}
            {selectedCourt?.admin.last_name} ({selectedCourt?.admin.email})
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={() => setIsModalOpen(false)}
              disabled={isUpdating}
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateAdmin}
              disabled={isUpdating || !selectedAdminId || selectedAdminId === selectedCourt?.admin.id}
            >
              {isUpdating ? 'Updating...' : 'Update Admin'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
