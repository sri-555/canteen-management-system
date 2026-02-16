from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import User, FoodCourt, MenuItem, Order, OrderItem, WalletTransaction
from decimal import Decimal

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name', 'role', 'wallet_balance', 'phone', 'is_blocked', 'date_joined']
        read_only_fields = ['wallet_balance', 'is_blocked', 'date_joined']

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'first_name', 'last_name', 'phone', 'role']
        extra_kwargs = {
            'role': {'default': 'student'},
            'email': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
        }
    
    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            role=validated_data.get('role', 'student')
        )
        # Set default wallet balance for students
        if user.role == 'student':
            user.wallet_balance = Decimal('500.00')
            user.save()
        return user

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)
    
    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            if user.is_blocked:
                raise serializers.ValidationError("Your account has been blocked.")
            return user
        raise serializers.ValidationError("Invalid credentials.")

class MenuItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = MenuItem
        fields = ['id', 'name', 'description', 'price', 'image_url', 'is_available', 'category', 'food_court']
        read_only_fields = ['id']
        extra_kwargs = {
            'food_court': {'required': False}  # Not required on update
        }

class FoodCourtSerializer(serializers.ModelSerializer):
    estimated_waiting_time = serializers.SerializerMethodField()
    admin_name = serializers.CharField(source='admin.username', read_only=True)
    
    class Meta:
        model = FoodCourt
        fields = ['id', 'name', 'description', 'is_open', 'avg_preparation_time', 
                  'active_staff_count', 'estimated_waiting_time', 'admin', 'admin_name', 
                  'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']
    
    def get_estimated_waiting_time(self, obj):
        return obj.get_estimated_waiting_time()

class FoodCourtDetailSerializer(serializers.ModelSerializer):
    menu_items = MenuItemSerializer(many=True, read_only=True)
    estimated_waiting_time = serializers.SerializerMethodField()
    
    class Meta:
        model = FoodCourt
        fields = ['id', 'name', 'description', 'is_open', 'avg_preparation_time', 
                  'active_staff_count', 'estimated_waiting_time', 'menu_items']
    
    def get_estimated_waiting_time(self, obj):
        return obj.get_estimated_waiting_time()

class OrderItemSerializer(serializers.ModelSerializer):
    menu_item_name = serializers.CharField(source='menu_item.name', read_only=True)
    
    class Meta:
        model = OrderItem
        fields = ['id', 'menu_item', 'menu_item_name', 'quantity', 'price']
        read_only_fields = ['id', 'price']

class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    student_name = serializers.CharField(source='student.username', read_only=True)
    food_court_name = serializers.CharField(source='food_court.name', read_only=True)
    
    class Meta:
        model = Order
        fields = ['id', 'student', 'student_name', 'food_court', 'food_court_name', 
                  'status', 'total_amount', 'items', 'created_at', 'updated_at']
        read_only_fields = ['id', 'student', 'total_amount', 'created_at', 'updated_at']

class CreateOrderSerializer(serializers.Serializer):
    food_court = serializers.IntegerField()
    items = serializers.ListField(
        child=serializers.DictField(child=serializers.IntegerField())
    )
    
    def validate(self, data):
        # Validate food court exists
        try:
            food_court = FoodCourt.objects.get(id=data['food_court'])
            if not food_court.is_open:
                raise serializers.ValidationError("Food court is currently closed.")
        except FoodCourt.DoesNotExist:
            raise serializers.ValidationError("Food court not found.")
        
        # Validate items
        if not data['items']:
            raise serializers.ValidationError("Order must contain at least one item.")
        
        for item in data['items']:
            if 'menu_item_id' not in item or 'quantity' not in item:
                raise serializers.ValidationError("Each item must have menu_item_id and quantity.")
            
            if item['quantity'] <= 0:
                raise serializers.ValidationError("Quantity must be greater than 0.")
            
            try:
                menu_item = MenuItem.objects.get(id=item['menu_item_id'], food_court=food_court)
                if not menu_item.is_available:
                    raise serializers.ValidationError(f"{menu_item.name} is not available.")
            except MenuItem.DoesNotExist:
                raise serializers.ValidationError(f"Menu item {item['menu_item_id']} not found.")
        
        return data

class WalletTransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = WalletTransaction
        fields = ['id', 'transaction_type', 'amount', 'description', 'balance_after', 'created_at']
        read_only_fields = ['id', 'balance_after', 'created_at']
