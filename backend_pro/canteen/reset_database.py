import mysql.connector
from mysql.connector import Error

def reset_database():
    """Drop and recreate the canteen database"""
    try:
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='S6r6i6***',
            port=3306
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Drop database if exists
            print("Dropping existing database...")
            cursor.execute("DROP DATABASE IF EXISTS canteen")
            print("✓ Database dropped")
            
            # Create fresh database
            cursor.execute("CREATE DATABASE canteen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print("✓ Database 'canteen' created")
            
            cursor.close()
            connection.close()
            
            print("\n✅ Database reset completed!")
            print("\nNext steps:")
            print("1. Run: python manage.py migrate")
            print("2. Run: python create_users.py")
            print("3. Run: python populate_food_courts.py")
            
    except Error as e:
        print(f"✗ Error: {e}")

if __name__ == '__main__':
    reset_database()
