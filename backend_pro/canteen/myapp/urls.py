from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView
from . import views

router = DefaultRouter()
router.register(r'food-courts', views.FoodCourtViewSet, basename='foodcourt')
router.register(r'student/orders', views.StudentOrderViewSet, basename='student-order')
router.register(r'admin/menu-items', views.MenuItemViewSet, basename='admin-menuitem')

urlpatterns = [
    # Authentication
    path('auth/register/', views.register, name='register'),
    path('auth/login/', views.login, name='login'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', views.profile, name='profile'),
    
    # Student endpoints
    path('student/wallet/balance/', views.wallet_balance, name='wallet-balance'),
    path('student/wallet/transactions/', views.wallet_transactions, name='wallet-transactions'),
    path('student/wallet/add/', views.add_wallet_balance, name='add-wallet-balance'),
    path('student/orders/place/', views.StudentOrderViewSet.as_view({'post': 'place_order'}), name='place-order'),
    
    # Food Court Admin endpoints
    path('admin/food-court/', views.admin_food_court, name='admin-food-court'),
    path('admin/food-court/update/', views.update_food_court, name='update-food-court'),
    path('admin/orders/', views.admin_orders, name='admin-orders'),
    path('admin/orders/<int:order_id>/status/', views.update_order_status, name='update-order-status'),
    path('admin/analytics/', views.admin_analytics, name='admin-analytics'),
    
    # Super Admin endpoints
    path('superadmin/food-courts/', views.all_food_courts, name='all-food-courts'),
    path('superadmin/food-courts/create/', views.create_food_court, name='create-food-court'),
    path('superadmin/food-courts/<int:food_court_id>/update-admin/', views.update_food_court_admin, name='update-food-court-admin'),
    path('superadmin/admins/create/', views.create_food_court_admin, name='create-food-court-admin'),
    path('superadmin/users/', views.all_users, name='all-users'),
    path('superadmin/users/<int:user_id>/block/', views.block_user, name='block-user'),
    path('superadmin/analytics/', views.system_analytics, name='system-analytics'),
    
    # Router URLs
    path('', include(router.urls)),
]
