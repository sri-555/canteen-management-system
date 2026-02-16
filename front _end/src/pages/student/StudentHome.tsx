import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Badge } from '../../components/ui/Badge';
import api from '../../services/api';
import { FoodCourt } from '../../types';
import { Clock, Star, ArrowRight, AlertCircle } from 'lucide-react';

export function StudentHome() {
  const [foodCourts, setFoodCourts] = useState<FoodCourt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFoodCourts();
  }, []);

  const fetchFoodCourts = async () => {
    try {
      const data = await api.student.getFoodCourts();
      setFoodCourts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading food courts...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center text-red-700">
        <AlertCircle className="w-5 h-5 mr-2" />
        Error: {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Food Courts</h1>
          <p className="text-gray-500 mt-1">Discover the best food on campus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {foodCourts.map((court) => (
          <Link key={court.id} to={`/student/court/${court.id}`}>
            <Card
              className="h-full hover:shadow-md transition-shadow cursor-pointer group"
              noPadding
            >
              <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                <div className="w-full h-full flex items-center justify-center text-6xl">
                  🍽️
                </div>
                <div className="absolute top-4 right-4">
                  <Badge
                    variant={court.is_open ? 'success' : 'error'}
                    className="shadow-sm"
                  >
                    {court.is_open ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                    {court.name}
                  </h3>
                </div>

                <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                  {court.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <div className="text-xs text-gray-500">
                    {court.admin_name && `Managed by ${court.admin_name}`}
                  </div>

                  {court.is_open && (
                    <div className="flex items-center text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {court.estimated_waiting_time} min
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {foodCourts.length === 0 && (
        <div className="text-center py-12 text-gray-400">
          No food courts available at the moment
        </div>
      )}
    </div>
  );
}
