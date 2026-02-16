import { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import {
  DollarSign,
  ShoppingBag,
  Users,
  Store,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { motion } from 'framer-motion';
import api from '../../services/api';
const revenueData = [
{
  name: 'Mon',
  revenue: 4200
},
{
  name: 'Tue',
  revenue: 3800
},
{
  name: 'Wed',
  revenue: 5100
},
{
  name: 'Thu',
  revenue: 4900
},
{
  name: 'Fri',
  revenue: 6200
},
{
  name: 'Sat',
  revenue: 7800
},
{
  name: 'Sun',
  revenue: 7100
}];

export function RevenueDashboard() {
  const [analytics, setAnalytics] = useState<any>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const analyticsData = await api.superAdmin.getSystemAnalytics() as any;
      setAnalytics(analyticsData);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  // Generate chart data from real food courts with revenue
  const foodCourtData = analytics?.food_court_revenue?.slice(0, 6).map((court: any) => ({
    name: court.name,
    revenue: court.revenue
  })) || [];

  const topFoodCourts = analytics?.food_court_revenue?.map((court: any) => ({
    name: court.name,
    orders: court.orders,
    revenue: court.revenue,
    growth: court.growth || 0
  })) || [];

  const containerVariants = {
    hidden: {
      opacity: 0
    },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 20
    },
    show: {
      opacity: 1,
      y: 0
    }
  };
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8">

      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Revenue Dashboard</h1>
        <div className="text-sm text-gray-500">Last updated: Just now</div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
        {
          label: 'Total Revenue',
          value: analytics ? `₹${parseFloat(analytics.total_revenue || 0).toLocaleString()}` : '₹0',
          trend: analytics?.today_revenue ? `₹${parseFloat(analytics.today_revenue).toFixed(2)} today` : '₹0 today',
          trendUp: true,
          icon: DollarSign,
          color: 'text-green-600',
          bg: 'bg-green-50'
        },
        {
          label: 'Total Orders',
          value: analytics ? analytics.total_orders.toLocaleString() : '0',
          trend: 'All time',
          trendUp: true,
          icon: ShoppingBag,
          color: 'text-blue-600',
          bg: 'bg-blue-50'
        },
        {
          label: 'Active Food Courts',
          value: analytics ? analytics.total_food_courts.toString() : '0',
          trend: 'Total courts',
          trendUp: true,
          icon: Store,
          color: 'text-purple-600',
          bg: 'bg-purple-50'
        },
        {
          label: 'Total Students',
          value: analytics ? analytics.total_students.toLocaleString() : '0',
          trend: 'Registered users',
          trendUp: true,
          icon: Users,
          color: 'text-indigo-600',
          bg: 'bg-indigo-50'
        }].
        map((stat, i) =>
        <motion.div key={i} variants={itemVariants}>
            <Card className="p-6 h-full">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-2">
                    {stat.value}
                  </p>
                  <div
                  className={`flex items-center mt-2 text-xs font-medium ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>

                    {stat.trendUp ?
                  <TrendingUp className="w-3 h-3 mr-1" /> :

                  <TrendingDown className="w-3 h-3 mr-1" />
                  }
                    {stat.trend}
                  </div>
                </div>
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                  <stat.icon className="w-6 h-6" />
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Revenue Trend
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient
                      id="colorRevenue"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1">

                      <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.1} />
                      <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f3f4f6" />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#6b7280',
                      fontSize: 12
                    }}
                    dy={10} />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: '#6b7280',
                      fontSize: 12
                    }}
                    tickFormatter={(value) => `₹${value}`}
                  />

                  <Tooltip
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`₹${value}`, 'Revenue']} />

                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)" />

                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="p-6 h-full">
            <h3 className="text-lg font-bold text-gray-900 mb-6">
              Revenue by Food Court
            </h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={foodCourtData} layout="vertical">
                  <CartesianGrid
                    strokeDasharray="3 3"
                    horizontal={true}
                    vertical={false}
                    stroke="#f3f4f6" />

                  <XAxis type="number" hide />
                  <YAxis
                    dataKey="name"
                    type="category"
                    axisLine={false}
                    tickLine={false}
                    width={100}
                    tick={{
                      fill: '#6b7280',
                      fontSize: 12
                    }} />

                  <Tooltip
                    cursor={{
                      fill: '#f9fafb'
                    }}
                    contentStyle={{
                      borderRadius: '8px',
                      border: 'none',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`₹${value}`, 'Revenue']} />

                  <Bar
                    dataKey="revenue"
                    fill="#4f46e5"
                    radius={[0, 4, 4, 0]}
                    barSize={32} />

                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Top Performing Food Courts */}
      <motion.div variants={itemVariants}>
        <Card className="p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-6">
            Top Performing Food Courts
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-4">
                    Food Court
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-4">
                    Orders
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-4">
                    Revenue
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-4">
                    Growth
                  </th>
                  <th className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider pb-4 w-1/3">
                    Performance
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {topFoodCourts.map((court: any, i: number) => (
                  <tr
                    key={i}
                    className="group hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 text-sm font-medium text-gray-900">
                      {court.name}
                    </td>
                    <td className="py-4 text-sm text-gray-600">
                      {court.orders}
                    </td>
                    <td className="py-4 text-sm font-medium text-gray-900">
                      ₹{court.revenue.toLocaleString()}
                    </td>
                    <td className="py-4 text-sm">
                      <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${court.growth > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>

                        {court.growth > 0 ? '+' : ''}
                        {court.growth}%
                      </span>
                    </td>
                    <td className="py-4">
                      <div className="w-full bg-gray-100 rounded-full h-2">
                        <div
                        className="bg-indigo-600 h-2 rounded-full"
                        style={{
                          width: `${court.revenue / 15000 * 100}%`
                        }}
                      />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </motion.div>
    </motion.div>);

}