// API Configuration and Base Service
const API_BASE_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:8000/api';

// Token management
export const tokenManager = {
  getAccessToken: (): string | null => {
    return localStorage.getItem('access_token');
  },
  
  getRefreshToken: (): string | null => {
    return localStorage.getItem('refresh_token');
  },
  
  setTokens: (access: string, refresh: string) => {
    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
  },
  
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('food_court_user');
  }
};

// API Error class
export class APIError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message);
    this.name = 'APIError';
  }
}

// Base fetch wrapper with auth
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = tokenManager.getAccessToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
  
  // Handle 401 - try to refresh token
  if (response.status === 401 && token) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      // Retry the request with new token
      headers['Authorization'] = `Bearer ${tokenManager.getAccessToken()}`;
      const retryResponse = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
      
      if (!retryResponse.ok) {
        const errorData = await retryResponse.json().catch(() => ({}));
        throw new APIError(retryResponse.status, errorData.detail || 'Request failed', errorData);
      }
      
      return retryResponse.json();
    } else {
      // Refresh failed, logout
      tokenManager.clearTokens();
      window.location.href = '/login';
      throw new APIError(401, 'Session expired');
    }
  }
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new APIError(
      response.status,
      errorData.detail || errorData.error || 'Request failed',
      errorData
    );
  }
  
  return response.json();
}

// Refresh access token
async function refreshAccessToken(): Promise<boolean> {
  const refreshToken = tokenManager.getRefreshToken();
  if (!refreshToken) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      tokenManager.setTokens(data.access, refreshToken);
      return true;
    }
  } catch (error) {
    console.error('Token refresh failed:', error);
  }
  
  return false;
}

// API Service
export const api = {
  // Authentication
  auth: {
    register: (data: {
      username: string;
      email: string;
      password: string;
      first_name: string;
      last_name: string;
      phone?: string;
      role?: string;
    }) => apiFetch('/auth/register/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    
    login: (username: string, password: string) =>
      apiFetch<{
        user: any;
        access: string;
        refresh: string;
      }>('/auth/login/', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
      }),
    
    getProfile: () => apiFetch('/auth/profile/', { method: 'GET' }),
  },
  
  // Student APIs
  student: {
    // Food Courts
    getFoodCourts: () => apiFetch('/food-courts/', { method: 'GET' }),
    
    getFoodCourtMenu: (id: number) =>
      apiFetch(`/food-courts/${id}/`, { method: 'GET' }),
    
    // Orders
    placeOrder: (data: {
      food_court: number;
      items: Array<{ menu_item_id: number; quantity: number }>;
    }) =>
      apiFetch('/student/orders/place/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    getOrders: () => apiFetch('/student/orders/', { method: 'GET' }),
    
    getOrder: (id: number) =>
      apiFetch(`/student/orders/${id}/`, { method: 'GET' }),
    
    // Wallet
    getWalletBalance: () =>
      apiFetch<{ balance: string }>('/student/wallet/balance/', {
        method: 'GET',
      }),
    
    getWalletTransactions: () =>
      apiFetch('/student/wallet/transactions/', { method: 'GET' }),
    
    addWalletBalance: (amount: number) =>
      apiFetch('/student/wallet/add/', {
        method: 'POST',
        body: JSON.stringify({ amount: amount.toString() }),
      }),
  },
  
  // Food Court Admin APIs
  admin: {
    // Food Court Management
    getFoodCourt: () => apiFetch('/admin/food-court/', { method: 'GET' }),
    
    updateFoodCourt: (data: {
      is_open?: boolean;
      avg_preparation_time?: number;
      active_staff_count?: number;
      description?: string;
    }) =>
      apiFetch('/admin/food-court/update/', {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    // Menu Management
    getMenuItems: () => apiFetch('/admin/menu-items/', { method: 'GET' }),
    
    addMenuItem: (data: {
      name: string;
      description: string;
      price: string;
      category: string;
      is_available: boolean;
      food_court: number;
      image_url?: string;
    }) =>
      apiFetch('/admin/menu-items/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    updateMenuItem: (id: number, data: Partial<{
      name: string;
      description: string;
      price: string;
      category: string;
      is_available: boolean;
      image_url: string;
    }>) =>
      apiFetch(`/admin/menu-items/${id}/`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      }),
    
    deleteMenuItem: (id: number) =>
      apiFetch(`/admin/menu-items/${id}/`, { method: 'DELETE' }),
    
    // Orders
    getOrders: () => apiFetch('/admin/orders/', { method: 'GET' }),
    
    updateOrderStatus: (orderId: number, status: string) =>
      apiFetch(`/admin/orders/${orderId}/status/`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      }),
    
    // Analytics
    getAnalytics: () => apiFetch('/admin/analytics/', { method: 'GET' }),
  },
  
  // Super Admin APIs
  superAdmin: {
    // Food Courts
    getAllFoodCourts: () =>
      apiFetch('/superadmin/food-courts/', { method: 'GET' }),
    
    createFoodCourt: (data: {
      name: string;
      description: string;
      admin: number;
      is_open: boolean;
      avg_preparation_time: number;
      active_staff_count: number;
    }) =>
      apiFetch('/superadmin/food-courts/create/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    updateFoodCourtAdmin: (foodCourtId: number, adminId: number) =>
      apiFetch(`/superadmin/food-courts/${foodCourtId}/update-admin/`, {
        method: 'PATCH',
        body: JSON.stringify({ admin_id: adminId }),
      }),
    
    // Admins
    createFoodCourtAdmin: (data: {
      username: string;
      email: string;
      password: string;
      first_name: string;
      last_name: string;
    }) =>
      apiFetch('/superadmin/admins/create/', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    
    // Users
    getAllUsers: () => apiFetch('/superadmin/users/', { method: 'GET' }),
    
    blockUser: (userId: number, isBlocked: boolean) =>
      apiFetch(`/superadmin/users/${userId}/block/`, {
        method: 'PATCH',
        body: JSON.stringify({ is_blocked: isBlocked }),
      }),
    
    // Analytics
    getSystemAnalytics: () =>
      apiFetch('/superadmin/analytics/', { method: 'GET' }),
  },
};

export default api;
