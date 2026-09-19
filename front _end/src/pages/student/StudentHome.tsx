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
        <div className="transform transition-all duration-500 hover:translate-x-2">
          <h1 className="text-3xl font-bold text-gray-900 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Food Courts
          </h1>
          <p className="text-gray-500 mt-2">Discover the best food on campus</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {foodCourts.map((court, index) => (
          <Link
            key={court.id}
            to={`/student/court/${court.id}`}
            className="group"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <Card
              className="h-full cursor-pointer overflow-hidden transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-2"
              noPadding
              style={{
                boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.1)',
              }}
            >
              <div className="relative h-52 overflow-hidden bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 group-hover:from-indigo-500/20 group-hover:to-purple-500/20 transition-all duration-500"></div>
                <div className="w-full h-full flex items-center justify-center text-7xl transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6">
                  🍽️
                </div>
                <div className="absolute top-4 right-4 transform transition-all duration-300 group-hover:scale-110">
                  <Badge
                    variant={court.is_open ? 'success' : 'error'}
                    className="shadow-lg backdrop-blur-sm"
                  >
                    {court.is_open ? 'Open Now' : 'Closed'}
                  </Badge>
                </div>
                {court.is_open && (
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-400 to-emerald-500 transform origin-left transition-transform duration-500 group-hover:scale-x-100 scale-x-0"></div>
                )}
              </div>

              <div className="p-6 bg-white relative">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>

                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-indigo-600 transition-colors duration-300">
                    {court.name}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-indigo-600 transform transition-all duration-300 group-hover:translate-x-2 opacity-0 group-hover:opacity-100" />
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                  {court.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
                  <div className="text-xs text-gray-500 font-medium">
                    {court.admin_name && `Managed by ${court.admin_name}`}
                  </div>

                  {court.is_open && (
                    <div className="flex items-center text-xs font-semibold text-indigo-600 bg-indigo-50 px-3 py-1.5 rounded-xl shadow-sm transform transition-all duration-300 group-hover:shadow-md group-hover:bg-indigo-100">
                      <Clock className="w-3.5 h-3.5 mr-1.5" />
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
        <div className="text-center py-16 text-gray-400">
          <div className="text-6xl mb-4 opacity-50">🍽️</div>
          <p className="text-lg">No food courts available at the moment</p>
        </div>
      )}
    </div>
  );
}
