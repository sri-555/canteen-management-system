import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { StudentHome } from './pages/student/StudentHome';
import { FoodCourtMenu } from './pages/student/FoodCourtMenu';
import { OrderTracker } from './pages/student/OrderTracker';
import { Wallet } from './pages/student/Wallet';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { MenuManagement } from './pages/admin/MenuManagement';
import { OrderQueue } from './pages/admin/OrderQueue';
import { RevenueDashboard } from './pages/superadmin/RevenueDashboard';
import { FoodCourtManagement } from './pages/superadmin/FoodCourtManagement';
import { UserManagement } from './pages/superadmin/UserManagement';
import { Drawer } from './components/ui/Drawer';
import { Button } from './components/ui/Button';
import { Role } from './types';
import { Trash2 } from 'lucide-react';
import api from './services/api';
// Protected Route Component
function ProtectedRoute({
  children,
  allowedRoles



}: {children: React.ReactNode;allowedRoles: Role[];}) {
  const { user, isLoading } = useAuth();
  if (isLoading)
  return (
    <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>);

  if (!user) return <Navigate to="/login" replace />;
  if (!allowedRoles.includes(user.role)) {
    // Redirect to appropriate dashboard based on role
    if (user.role === 'student') return <Navigate to="/student" replace />;
    if (user.role === 'food_court_admin') return <Navigate to="/admin" replace />;
    if (user.role === 'super_admin')
    return <Navigate to="/super-admin" replace />;
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
}
// Cart Drawer Component (Global)
function CartDrawer() {
  const { isOpen, setIsOpen, items, removeFromCart, total, clearCart, foodCourtId } =
  useCart();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    if (!foodCourtId || items.length === 0) return;
    
    setIsProcessing(true);
    setError('');
    
    try {
      const orderData = {
        food_court: foodCourtId,
        items: items.map(item => ({
          menu_item_id: item.menuItem.id,
          quantity: item.quantity
        }))
      };
      
      await api.student.placeOrder(orderData);
      
      // Success - clear cart and navigate to orders
      clearCart();
      setIsOpen(false);
      navigate('/student/orders');
    } catch (err: any) {
      setError(err.message || 'Failed to place order. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Drawer
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      title="Your Cart"
      footer={
      items.length > 0 &&
      <div className="space-y-4">
            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <Button 
              className="w-full" 
              size="lg"
              onClick={handleCheckout}
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Checkout'}
            </Button>
          </div>

      }>

      {items.length === 0 ?
      <div className="h-full flex flex-col items-center justify-center text-gray-500 space-y-4">
          <p>Your cart is empty</p>
          <Button variant="secondary" onClick={() => setIsOpen(false)}>
            Start Ordering
          </Button>
        </div> :

      <div className="space-y-6">
          {items.map((item) =>
        <div key={item.menuItem.id} className="flex gap-4">
              <img
            src={item.menuItem.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'}
            alt={item.menuItem.name}
            className="w-20 h-20 rounded-lg object-cover bg-gray-100" />

              <div className="flex-1">
                <h4 className="font-medium text-gray-900">{item.menuItem.name}</h4>
                <p className="text-sm text-gray-500 mb-2">
                  ₹{parseFloat(item.menuItem.price).toFixed(2)}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    Qty: {item.quantity}
                  </span>
                  <button
                onClick={() => removeFromCart(item.menuItem.id)}
                className="text-red-500 hover:text-red-700 p-1 rounded-md hover:bg-red-50">

                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
        )}
          <Button
          variant="ghost"
          className="w-full text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={clearCart}>

            Clear Cart
          </Button>
        </div>
      }
    </Drawer>);

}
export function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* Student Routes */}
            <Route
              element={
              <ProtectedRoute allowedRoles={['student']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>

              <Route path="/student" element={<StudentHome />} />
              <Route path="/student/court/:id" element={<FoodCourtMenu />} />
              <Route path="/student/orders" element={<OrderTracker />} />
              <Route path="/student/wallet" element={<Wallet />} />
            </Route>

            {/* Admin Routes */}
            <Route
              element={
              <ProtectedRoute allowedRoles={['food_court_admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>

              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/menu" element={<MenuManagement />} />
              <Route path="/admin/orders" element={<OrderQueue />} />
            </Route>

            {/* Super Admin Routes */}
            <Route
              element={
              <ProtectedRoute allowedRoles={['super_admin']}>
                  <DashboardLayout />
                </ProtectedRoute>
              }>

              <Route path="/super-admin" element={<RevenueDashboard />} />
              <Route
                path="/super-admin/food-courts"
                element={<FoodCourtManagement />} />

              <Route path="/super-admin/users" element={<UserManagement />} />
            </Route>
          </Routes>
          <CartDrawer />
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>);

}