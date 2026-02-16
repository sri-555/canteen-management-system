import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import FoodCourt

def remove_old_food_courts():
    print("Removing old food courts...")
    
    # Food courts to remove
    courts_to_remove = ['North Campus Canteen', 'Main Cafeteria']
    
    for court_name in courts_to_remove:
        try:
            court = FoodCourt.objects.get(name=court_name)
            menu_items_count = court.menu_items.count()
            orders_count = court.orders.count()
            
            print(f"\nRemoving: {court_name}")
            print(f"  - Menu items: {menu_items_count}")
            print(f"  - Orders: {orders_count}")
            
            court.delete()
            print(f"  ✓ Deleted successfully")
            
        except FoodCourt.DoesNotExist:
            print(f"\n✓ {court_name} not found (already removed or doesn't exist)")
    
    # Show remaining food courts
    print("\n" + "="*50)
    print("REMAINING FOOD COURTS")
    print("="*50)
    remaining_courts = FoodCourt.objects.all()
    for court in remaining_courts:
        menu_count = court.menu_items.count()
        print(f"  - {court.name} ({menu_count} menu items)")
    
    print(f"\nTotal Food Courts: {remaining_courts.count()}")
    print("\n✅ Cleanup completed successfully!")

if __name__ == '__main__':
    remove_old_food_courts()
