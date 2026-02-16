from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, FoodCourt, MenuItem, Order, OrderItem, WalletTransaction

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['username', 'email', 'role', 'wallet_balance', 'is_blocked']
    list_filter = ['role', 'is_blocked', 'is_staff']
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Custom Fields', {'fields': ('role', 'wallet_balance', 'is_blocked', 'phone')}),
    )
    add_fieldsets = BaseUserAdmin.add_fieldsets + (
        ('Custom Fields', {'fields': ('role', 'wallet_balance', 'phone')}),
    )

@admin.register(FoodCourt)
class FoodCourtAdmin(admin.ModelAdmin):
    list_display = ['name', 'admin', 'is_open', 'avg_preparation_time', 'active_staff_count']
    list_filter = ['is_open']
    search_fields = ['name', 'admin__username']

@admin.register(MenuItem)
class MenuItemAdmin(admin.ModelAdmin):
    list_display = ['name', 'food_court', 'price', 'is_available', 'category']
    list_filter = ['is_available', 'food_court', 'category']
    search_fields = ['name', 'food_court__name']

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'student', 'food_court', 'status', 'total_amount', 'created_at']
    list_filter = ['status', 'food_court', 'created_at']
    search_fields = ['student__username', 'food_court__name']
    inlines = [OrderItemInline]

@admin.register(WalletTransaction)
class WalletTransactionAdmin(admin.ModelAdmin):
    list_display = ['user', 'transaction_type', 'amount', 'balance_after', 'created_at']
    list_filter = ['transaction_type', 'created_at']
    search_fields = ['user__username', 'description']
