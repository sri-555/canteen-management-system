import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'canteen.settings')
django.setup()

from myapp.models import FoodCourt

courts = FoodCourt.objects.all().order_by('id')
print(f'Total Food Courts: {courts.count()}\n')

for i, c in enumerate(courts):
    print(f'{i+1}. {c.name}')
    print(f'   Admin: {c.admin.username} ({c.admin.email})')
    print(f'   Menu Items: {c.menu_items.count()}')
    print(f'   Status: {"Open" if c.is_open else "Closed"}')
    print()
