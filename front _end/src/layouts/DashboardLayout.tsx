import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import {
  LayoutDashboard,
  Utensils,
  ShoppingBag,
  Wallet,
  Settings,
  LogOut,
  Menu as MenuIcon,
  X,
  Users,
  Store,
  ShoppingCart,
  ChefHat } from
'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
export function DashboardLayout() {
  const { user, logout } = useAuth();
  const { itemCount, setIsOpen } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleLogout = () => {
    logout();
    navigate('/login');
  };
  const getNavItems = () => {
    switch (user?.role) {
      case 'student':
        return [
        {
          name: 'Food Courts',
          href: '/student',
          icon: Store
        },
        {
          name: 'My Orders',
          href: '/student/orders',
          icon: ShoppingBag
        },
        {
          name: 'Wallet',
          href: '/student/wallet',
          icon: Wallet
        }];

      case 'admin':
        return [
        {
          name: 'Dashboard',
          href: '/admin',
          icon: LayoutDashboard
        },
        {
          name: 'Menu',
          href: '/admin/menu',
          icon: Utensils
        },
        {
          name: 'Orders',
          href: '/admin/orders',
          icon: ChefHat
        }];

      case 'super_admin':
        return [
        {
          name: 'Overview',
          href: '/super-admin',
          icon: LayoutDashboard
        },
        {
          name: 'Food Courts',
          href: '/super-admin/food-courts',
          icon: Store
        },
        {
          name: 'Users',
          href: '/super-admin/users',
          icon: Users
        }];

      default:
        return [];
    }
  };
  const navItems = getNavItems();
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar - Desktop */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-gray-100 fixed inset-y-0 z-30">
        <div className="flex items-center h-16 px-6 border-b border-gray-100">
          <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
            <Utensils className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900">FoodCourt</span>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={`
                  flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
                  ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                `}>

                <item.icon
                  className={`mr-3 h-5 w-5 ${isActive ? 'text-indigo-600' : 'text-gray-400'}`} />

                {item.name}
              </NavLink>);

          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center px-4 py-3 mb-2">
            <img
              src={
              user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}`
              }
              alt={user?.name}
              className="h-8 w-8 rounded-full bg-gray-200" />

            <div className="ml-3">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">
                {user?.role.replace('_', ' ')}
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors">

            <LogOut className="mr-3 h-5 w-5" />
            Sign out
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 z-30 flex items-center justify-between px-4">
        <div className="flex items-center">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-lg">

            <MenuIcon className="h-6 w-6" />
          </button>
          <span className="ml-3 text-lg font-bold text-gray-900">
            FoodCourt
          </span>
        </div>

        {user?.role === 'student' &&
        <button
          onClick={() => setIsOpen(true)}
          className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg">

            <ShoppingCart className="h-6 w-6" />
            {itemCount > 0 &&
          <span className="absolute top-1 right-1 h-4 w-4 bg-indigo-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full">
                {itemCount}
              </span>
          }
          </button>
        }
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen &&
        <>
            <motion.div
            initial={{
              opacity: 0
            }}
            animate={{
              opacity: 1
            }}
            exit={{
              opacity: 0
            }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden" />

            <motion.div
            initial={{
              x: '-100%'
            }}
            animate={{
              x: 0
            }}
            exit={{
              x: '-100%'
            }}
            className="fixed inset-y-0 left-0 w-64 bg-white z-50 md:hidden flex flex-col">

              <div className="flex items-center justify-between h-16 px-6 border-b border-gray-100">
                <span className="text-lg font-bold text-gray-900">Menu</span>
                <button onClick={() => setIsMobileMenuOpen(false)}>
                  <X className="h-6 w-6 text-gray-500" />
                </button>
              </div>
              <nav className="flex-1 px-4 py-6 space-y-1">
                {navItems.map((item) =>
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) => `
                      flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-colors
                      ${isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
                    `}>

                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
              )}
              </nav>
              <div className="p-4 border-t border-gray-100">
                <button
                onClick={handleLogout}
                className="flex w-full items-center px-4 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50">

                  <LogOut className="mr-3 h-5 w-5" />
                  Sign out
                </button>
              </div>
            </motion.div>
          </>
        }
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-1 md:pl-64 pt-16 md:pt-0 min-h-screen">
        <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
          {/* Header Actions (Cart for students) */}
          {user?.role === 'student' &&
          <div className="hidden md:flex justify-end mb-6">
              <button
              onClick={() => setIsOpen(true)}
              className="flex items-center px-4 py-2 bg-white border border-gray-200 rounded-xl shadow-sm hover:bg-gray-50 transition-colors">

                <ShoppingCart className="h-5 w-5 text-gray-600 mr-2" />
                <span className="text-sm font-medium text-gray-700">Cart</span>
                {itemCount > 0 &&
              <span className="ml-2 bg-indigo-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {itemCount}
                  </span>
              }
              </button>
            </div>
          }

          <Outlet />
        </div>
      </main>
    </div>);

}