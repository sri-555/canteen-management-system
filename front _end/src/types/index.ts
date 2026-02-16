export type Role = 'student' | 'food_court_admin' | 'super_admin';

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: Role;
  wallet_balance: string;
  phone?: string;
  is_blocked: boolean;
}

export interface FoodCourt {
  id: number;
  name: string;
  description: string;
  is_open: boolean;
  avg_preparation_time: number;
  active_staff_count: number;
  estimated_waiting_time: number;
  admin?: number;
  admin_name?: string;
  created_at?: string;
  updated_at?: string;
  menu_items?: MenuItem[];
}

export interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url?: string;
  is_available: boolean;
  category: string;
  food_court: number;
  created_at?: string;
  updated_at?: string;
}

export interface CartItem {
  id: number;
  menu_item: MenuItem;
  quantity: number;
}

export type OrderStatus = 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';

export interface OrderItem {
  id: number;
  menu_item: number;
  menu_item_name: string;
  quantity: number;
  price: string;
}

export interface Order {
  id: number;
  student: number;
  student_name: string;
  food_court: number;
  food_court_name: string;
  status: OrderStatus;
  total_amount: string;
  items: OrderItem[];
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  transaction_type: 'credit' | 'debit';
  amount: string;
  description: string;
  balance_after: string;
  created_at: string;
}

// Analytics Types
export interface AdminAnalytics {
  total_orders_today: number;
  revenue_today: string;
  most_selling_item: string;
  most_selling_quantity: number;
}

export interface SystemAnalytics {
  total_revenue: string;
  today_revenue: string;
  total_orders: number;
  total_students: number;
  total_food_courts: number;
}