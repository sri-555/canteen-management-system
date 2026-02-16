from rest_framework import viewsets, status, generics
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.db.models import Sum, Count, Q
from django.db import transaction
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
from datetime import datetime, timedelta
from decimal import Decimal

from .models import User, FoodCourt, MenuItem, Order, OrderItem, WalletTransaction
from .serializers import (
    UserSerializer, RegisterSerializer, LoginSerializer,
    FoodCourtSerializer, FoodCourtDetailSerializer, MenuItemSerializer,
    OrderSerializer, CreateOrderSerializer, WalletTransactionSerializer
)
from .permissions import IsStudent, IsFoodCourtAdmin, IsSuperAdmin, IsFoodCourtAdminOrSuperAdmin

# Authentication Views
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = RegisterSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)
    
    # Log the errors for debugging
    print("Registration validation errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.validated_data
        refresh = RefreshToken.for_user(user)
        return Response({
            'user': UserSerializer(user).data,
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)

# Student Views
class FoodCourtViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FoodCourt.objects.all()
    serializer_class = FoodCourtSerializer
    permission_classes = [IsAuthenticated]
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return FoodCourtDetailSerializer
        return FoodCourtSerializer

class StudentOrderViewSet(viewsets.ModelViewSet):
    serializer_class = OrderSerializer
    permission_classes = [IsStudent]
    
    def get_queryset(self):
        return Order.objects.filter(student=self.request.user)
    
    @action(detail=False, methods=['post'])
    def place_order(self, request):
        serializer = CreateOrderSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        food_court = FoodCourt.objects.get(id=data['food_court'])
        
        # Calculate total amount
        total_amount = Decimal('0.00')
        order_items_data = []
        
        for item in data['items']:
            menu_item = MenuItem.objects.get(id=item['menu_item_id'])
            item_total = menu_item.price * item['quantity']
            total_amount += item_total
            order_items_data.append({
                'menu_item': menu_item,
                'quantity': item['quantity'],
                'price': menu_item.price
            })
        
        # Check wallet balance
        if request.user.wallet_balance < total_amount:
            return Response({
                'error': 'Insufficient wallet balance',
                'required': str(total_amount),
                'available': str(request.user.wallet_balance)
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Create order and deduct from wallet
        with transaction.atomic():
            order = Order.objects.create(
                student=request.user,
                food_court=food_court,
                total_amount=total_amount,
                status='pending'
            )
            
            for item_data in order_items_data:
                OrderItem.objects.create(order=order, **item_data)
            
            # Deduct from wallet
            request.user.wallet_balance -= total_amount
            request.user.save()
            
            # Create wallet transaction
            WalletTransaction.objects.create(
                user=request.user,
                transaction_type='debit',
                amount=total_amount,
                description=f'Order #{order.id} at {food_court.name}',
                order=order,
                balance_after=request.user.wallet_balance
            )
            
            # Send email notification to food court admin
            try:
                # Prepare order items list for email
                items_list = '\n'.join([
                    f"  - {item_data['menu_item'].name} x {item_data['quantity']} = ₹{float(item_data['price']) * item_data['quantity']:.2f}"
                    for item_data in order_items_data
                ])
                
                subject = f'New Order #{order.id} - {food_court.name}'
                message = f"""
Hello {food_court.admin.first_name},

You have received a new order at {food_court.name}!

Order Details:
--------------
Order ID: #{order.id}
Customer: {request.user.first_name} {request.user.last_name}
Email: {request.user.email}
Order Time: {order.created_at.strftime('%Y-%m-%d %H:%M:%S')}

Items Ordered:
{items_list}

Total Amount: ₹{float(total_amount):.2f}
Status: Pending

Please log in to your admin dashboard to view and process this order.

Dashboard: http://localhost:5173/admin/orders

Thank you!
Canteen Management System
"""
                
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[food_court.admin.email],
                    fail_silently=True,  # Don't fail if email sending fails
                )
            except Exception as e:
                # Log the error but don't fail the order
                print(f"Email notification failed: {str(e)}")
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)

@api_view(['GET'])
@permission_classes([IsStudent])
def wallet_balance(request):
    return Response({
        'balance': request.user.wallet_balance
    })

@api_view(['GET'])
@permission_classes([IsStudent])
def wallet_transactions(request):
    transactions = WalletTransaction.objects.filter(user=request.user)
    serializer = WalletTransactionSerializer(transactions, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsStudent])
def add_wallet_balance(request):
    amount = request.data.get('amount')
    if not amount or Decimal(amount) <= 0:
        return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)
    
    amount = Decimal(amount)
    with transaction.atomic():
        request.user.wallet_balance += amount
        request.user.save()
        
        WalletTransaction.objects.create(
            user=request.user,
            transaction_type='credit',
            amount=amount,
            description='Wallet recharge',
            balance_after=request.user.wallet_balance
        )
    
    return Response({
        'balance': request.user.wallet_balance,
        'message': 'Wallet recharged successfully'
    })

# Food Court Admin Views
class MenuItemViewSet(viewsets.ModelViewSet):
    serializer_class = MenuItemSerializer
    permission_classes = [IsFoodCourtAdmin]
    
    def get_queryset(self):
        return MenuItem.objects.filter(food_court__admin=self.request.user)
    
    def perform_create(self, serializer):
        food_court = serializer.validated_data['food_court']
        if food_court.admin != self.request.user:
            raise PermissionError("You can only add items to your own food court")
        serializer.save()
    
    def perform_update(self, serializer):
        # Don't allow changing the food_court on update
        if 'food_court' in serializer.validated_data:
            food_court = serializer.validated_data['food_court']
            if food_court.admin != self.request.user:
                raise PermissionError("You can only update items in your own food court")
        serializer.save()
    
    def perform_destroy(self, instance):
        # Check if the user owns this menu item's food court
        if instance.food_court.admin != self.request.user:
            raise PermissionError("You can only delete items from your own food court")
        instance.delete()

@api_view(['GET'])
@permission_classes([IsFoodCourtAdmin])
def admin_food_court(request):
    try:
        food_court = FoodCourt.objects.get(admin=request.user)
        serializer = FoodCourtDetailSerializer(food_court)
        return Response(serializer.data)
    except FoodCourt.DoesNotExist:
        return Response({'error': 'No food court assigned'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsFoodCourtAdmin])
def update_food_court(request):
    try:
        food_court = FoodCourt.objects.get(admin=request.user)
    except FoodCourt.DoesNotExist:
        return Response({'error': 'No food court assigned'}, status=status.HTTP_404_NOT_FOUND)
    
    allowed_fields = ['avg_preparation_time', 'active_staff_count', 'is_open', 'description']
    for field in allowed_fields:
        if field in request.data:
            setattr(food_court, field, request.data[field])
    
    food_court.save()
    serializer = FoodCourtSerializer(food_court)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsFoodCourtAdmin])
def admin_orders(request):
    try:
        food_court = FoodCourt.objects.get(admin=request.user)
    except FoodCourt.DoesNotExist:
        return Response({'error': 'No food court assigned'}, status=status.HTTP_404_NOT_FOUND)
    
    orders = Order.objects.filter(food_court=food_court)
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsFoodCourtAdmin])
def update_order_status(request, order_id):
    try:
        food_court = FoodCourt.objects.get(admin=request.user)
        order = Order.objects.get(id=order_id, food_court=food_court)
    except (FoodCourt.DoesNotExist, Order.DoesNotExist):
        return Response({'error': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)
    
    new_status = request.data.get('status')
    if new_status not in ['pending', 'preparing', 'ready', 'completed', 'cancelled']:
        return Response({'error': 'Invalid status'}, status=status.HTTP_400_BAD_REQUEST)
    
    order.status = new_status
    order.save()
    
    return Response(OrderSerializer(order).data)

@api_view(['GET'])
@permission_classes([IsFoodCourtAdmin])
def admin_analytics(request):
    try:
        food_court = FoodCourt.objects.get(admin=request.user)
    except FoodCourt.DoesNotExist:
        return Response({'error': 'No food court assigned'}, status=status.HTTP_404_NOT_FOUND)
    
    today = timezone.now().date()
    today_orders = Order.objects.filter(
        food_court=food_court,
        created_at__date=today
    )
    
    total_orders = today_orders.count()
    revenue = today_orders.filter(
        status__in=['completed', 'ready', 'preparing', 'pending']
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Most selling item
    most_selling = OrderItem.objects.filter(
        order__food_court=food_court,
        order__created_at__date=today
    ).values('menu_item__name').annotate(
        total_quantity=Sum('quantity')
    ).order_by('-total_quantity').first()
    
    return Response({
        'total_orders_today': total_orders,
        'revenue_today': revenue,
        'most_selling_item': most_selling['menu_item__name'] if most_selling else 'N/A',
        'most_selling_quantity': most_selling['total_quantity'] if most_selling else 0
    })

# Super Admin Views
@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def all_food_courts(request):
    food_courts = FoodCourt.objects.all()
    serializer = FoodCourtSerializer(food_courts, many=True)
    return Response(serializer.data)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def create_food_court(request):
    serializer = FoodCourtSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PATCH'])
@permission_classes([IsSuperAdmin])
def update_food_court_admin(request, food_court_id):
    try:
        food_court = FoodCourt.objects.get(id=food_court_id)
        admin_id = request.data.get('admin_id')
        
        if not admin_id:
            return Response({'error': 'admin_id is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            new_admin = User.objects.get(id=admin_id, role='food_court_admin')
        except User.DoesNotExist:
            return Response({'error': 'Admin user not found or not a food court admin'}, status=status.HTTP_404_NOT_FOUND)
        
        food_court.admin = new_admin
        food_court.save()
        
        return Response(FoodCourtSerializer(food_court).data)
    except FoodCourt.DoesNotExist:
        return Response({'error': 'Food court not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsSuperAdmin])
def update_food_court_status(request, food_court_id):
    try:
        food_court = FoodCourt.objects.get(id=food_court_id)
        is_open = request.data.get('is_open')
        
        if is_open is None:
            return Response({'error': 'is_open is required'}, status=status.HTTP_400_BAD_REQUEST)
        
        food_court.is_open = is_open
        food_court.save()
        
        return Response(FoodCourtSerializer(food_court).data)
    except FoodCourt.DoesNotExist:
        return Response({'error': 'Food court not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
@permission_classes([IsSuperAdmin])
def create_food_court_admin(request):
    data = request.data.copy()
    data['role'] = 'food_court_admin'
    serializer = RegisterSerializer(data=data)
    if serializer.is_valid():
        user = serializer.save()
        return Response(UserSerializer(user).data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['PATCH'])
@permission_classes([IsSuperAdmin])
def block_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_blocked = request.data.get('is_blocked', True)
        user.save()
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['PATCH'])
@permission_classes([IsSuperAdmin])
def update_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        
        # Update allowed fields
        if 'first_name' in request.data:
            user.first_name = request.data['first_name']
        if 'last_name' in request.data:
            user.last_name = request.data['last_name']
        if 'email' in request.data:
            user.email = request.data['email']
        if 'phone' in request.data:
            user.phone = request.data['phone']
        if 'is_blocked' in request.data:
            user.is_blocked = request.data['is_blocked']
        if 'wallet_balance' in request.data and user.role == 'student':
            user.wallet_balance = Decimal(request.data['wallet_balance'])
        
        user.save()
        return Response(UserSerializer(user).data)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE'])
@permission_classes([IsSuperAdmin])
def delete_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        
        # Prevent deleting yourself
        if user.id == request.user.id:
            return Response({'error': 'Cannot delete your own account'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Prevent deleting super admins
        if user.role == 'super_admin':
            return Response({'error': 'Cannot delete super admin accounts'}, status=status.HTTP_400_BAD_REQUEST)
        
        username = user.username
        user.delete()
        return Response({'message': f'User {username} deleted successfully'})
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
@permission_classes([IsSuperAdmin])
def system_analytics(request):
    total_revenue = Order.objects.filter(
        status__in=['completed', 'ready', 'preparing', 'pending']
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    total_orders = Order.objects.count()
    total_students = User.objects.filter(role='student').count()
    total_food_courts = FoodCourt.objects.count()
    
    today = timezone.now().date()
    yesterday = today - timedelta(days=1)
    
    today_revenue = Order.objects.filter(
        created_at__date=today,
        status__in=['completed', 'ready', 'preparing', 'pending']
    ).aggregate(total=Sum('total_amount'))['total'] or 0
    
    # Revenue by food court
    food_court_revenue = []
    for food_court in FoodCourt.objects.all():
        # Total revenue
        revenue = Order.objects.filter(
            food_court=food_court,
            status__in=['completed', 'ready', 'preparing', 'pending']
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Today's revenue
        today_revenue_fc = Order.objects.filter(
            food_court=food_court,
            created_at__date=today,
            status__in=['completed', 'ready', 'preparing', 'pending']
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Yesterday's revenue
        yesterday_revenue_fc = Order.objects.filter(
            food_court=food_court,
            created_at__date=yesterday,
            status__in=['completed', 'ready', 'preparing', 'pending']
        ).aggregate(total=Sum('total_amount'))['total'] or 0
        
        # Calculate growth percentage
        growth = 0
        if yesterday_revenue_fc > 0:
            growth = ((today_revenue_fc - yesterday_revenue_fc) / yesterday_revenue_fc) * 100
        elif today_revenue_fc > 0:
            growth = 100  # If no revenue yesterday but revenue today, 100% growth
        
        order_count = Order.objects.filter(
            food_court=food_court,
            status__in=['completed', 'ready', 'preparing', 'pending']
        ).count()
        
        food_court_revenue.append({
            'id': food_court.id,
            'name': food_court.name,
            'revenue': float(revenue),
            'orders': order_count,
            'growth': round(growth, 1)
        })
    
    # Sort by revenue descending
    food_court_revenue.sort(key=lambda x: x['revenue'], reverse=True)
    
    return Response({
        'total_revenue': total_revenue,
        'today_revenue': today_revenue,
        'total_orders': total_orders,
        'total_students': total_students,
        'total_food_courts': total_food_courts,
        'food_court_revenue': food_court_revenue
    })
