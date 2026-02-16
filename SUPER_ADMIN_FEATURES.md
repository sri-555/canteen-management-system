# Super Admin Features - Food Court Admin Management

## Overview
Super admins can now change/reassign food court admins from the Food Court Management page.

## How to Use

### Access the Feature
1. Login as super admin (username: `superadmin`, password: `super123`)
2. Navigate to "Food Court Management" from the sidebar
3. You'll see a table with all food courts and their current admins

### Change Food Court Admin
1. Click the edit icon (pencil) next to any food court
2. A modal will open showing:
   - Current admin details
   - Dropdown list of all available food court admins
3. Select a new admin from the dropdown
4. Click "Update Admin"
5. The change will be applied immediately

## Available Food Court Admins

| ID | Name | Email |
|----|------|-------|
| 2 | Main Cafeteria | cafeteria@canteen.com |
| 3 | North Campus | north@canteen.com |
| 9 | Admin 1 | foodcourt1@canteen.com |
| 10 | Admin 2 | foodcourt2@canteen.com |
| 11 | Admin 3 | foodcourt3@canteen.com |
| 12 | Admin 4 | foodcourt4@canteen.com |
| 13 | Admin 5 | foodcourt5@canteen.com |

## Current Food Court Assignments

| Food Court | Current Admin |
|------------|---------------|
| Food Court 1 | foodcourt1@canteen.com |
| Food Court 2 | foodcourt2@canteen.com |
| Food Court 3 | foodcourt3@canteen.com |
| Food Court 4 | foodcourt4@canteen.com |
| Food Court 5 | foodcourt5@canteen.com |

## Technical Details

### Backend API
- **Endpoint**: `PATCH /api/superadmin/food-courts/{food_court_id}/update-admin/`
- **Permission**: Super Admin only
- **Request Body**: `{ "admin_id": <user_id> }`
- **Response**: Updated food court details

### Frontend
- **Page**: `/super-admin/food-courts`
- **Component**: `FoodCourtManagement.tsx`
- Real-time data fetching from backend
- Dropdown shows only users with `food_court_admin` role
- Validation prevents assigning the same admin

## Features
✅ View all food courts with current admin assignments
✅ Change admin for any food court
✅ Dropdown shows only food court admin users
✅ Real-time updates after admin change
✅ Error handling and validation
✅ Current admin highlighted in modal
✅ Prevents assigning same admin (button disabled)

## Testing
1. Login as super admin
2. Go to Food Court Management
3. Click edit on "Food Court 1"
4. Change admin from "Admin 1" to "Admin 2"
5. Verify the change is reflected in the table
6. Login as the new admin to verify they can access that food court
