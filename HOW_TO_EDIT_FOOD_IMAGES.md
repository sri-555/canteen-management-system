# How to Edit Food Item Images

## Overview
Food court admins can easily add or edit images for menu items through the Menu Management page.

## Step-by-Step Guide

### 1. Login as Food Court Admin
- Go to http://localhost:5173/
- Login with any food court admin credentials:
  - Username: `foodcourt1_admin` (or 2, 3, 4, 5)
  - Password: `admin123`

### 2. Navigate to Menu Management
- Click on "Menu Management" in the sidebar
- You'll see a table with all your menu items

### 3. Edit an Existing Item's Image

#### Option A: Click Edit Button
1. Find the item you want to edit
2. Click the pencil/edit icon on the right side of the row
3. A modal will open showing the current item details

#### Option B: Add New Item with Image
1. Click the "Add Item" button at the top right
2. Fill in the item details

### 4. Upload or Change the Image

You have TWO options for adding/changing images:

#### Option 1: Upload Image File
1. In the modal, you'll see an upload area with a dashed border
2. Click on it or drag and drop an image file
3. Supported formats: PNG, JPG, GIF (max 5MB)
4. The image preview will appear immediately
5. To remove and change: Click the X button on the preview

#### Option 2: Use Image URL
1. Click "Or enter image URL instead" below the upload area
2. Paste a direct image URL (e.g., from Unsplash, your server, etc.)
3. The preview will show automatically
4. To switch back to file upload: Click "Upload file instead"

### 5. Save Changes
1. After uploading/entering the image
2. Fill in or update other details (name, price, category, etc.)
3. Click "Update Item" (for editing) or "Add Item" (for new items)
4. The changes will be saved immediately

### 6. Remove an Image
- While editing, if you want to remove the current image:
  1. Click the X button on the image preview
  2. Leave the image field empty
  3. Click "Update Item"
  4. The item will use a default placeholder image

## Tips

### Using Image URLs
Good sources for food images:
- **Unsplash**: https://unsplash.com/s/photos/food
  - Right-click on image → Copy image address
  - Example: `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500`

- **Your own server**: Upload images to your server and use the URL

### Image Requirements
- **Format**: PNG, JPG, or GIF
- **Size**: Maximum 5MB
- **Recommended dimensions**: 500x500 pixels or larger
- **Aspect ratio**: Square or 4:3 works best

### Best Practices
1. Use high-quality, appetizing food photos
2. Ensure good lighting in the images
3. Keep file sizes reasonable (under 1MB is ideal)
4. Use consistent image styles across your menu
5. Test the image URL before saving (paste in browser to verify)

## Troubleshooting

### Image not showing?
- Check if the URL is accessible (paste it in a browser)
- Ensure the URL ends with an image extension (.jpg, .png, etc.)
- Try uploading the file directly instead

### Upload failed?
- Check file size (must be under 5MB)
- Ensure it's an image file (not PDF, document, etc.)
- Try a different image format

### Image looks distorted?
- Use square or 4:3 aspect ratio images
- Recommended: 500x500px or 800x600px

## Example Workflow

1. Login as `foodcourt1_admin` / `admin123`
2. Go to Menu Management
3. Click edit on "Chicken Noodles"
4. Click the upload area
5. Select a chicken noodles image from your computer
6. Preview appears - looks good!
7. Click "Update Item"
8. Done! The new image is now visible to students

## Current Default Images
If no image is provided, items will show a default food placeholder image from Unsplash.

## Need Help?
- All food court admins have the same capabilities
- Changes are instant and visible to students immediately
- You can edit images as many times as needed
