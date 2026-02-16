import mysql.connector
from mysql.connector import Error

def create_database():
    """Create the canteen database if it doesn't exist"""
    try:
        # Connect to MySQL server (without specifying database)
        connection = mysql.connector.connect(
            host='localhost',
            user='root',
            password='S6r6i6***',
            port=3306
        )
        
        if connection.is_connected():
            cursor = connection.cursor()
            
            # Create database if not exists
            cursor.execute("CREATE DATABASE IF NOT EXISTS canteen CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci")
            print("✓ Database 'canteen' created or already exists")
            
            # Show existing databases
            cursor.execute("SHOW DATABASES")
            databases = cursor.fetchall()
            print("\nAvailable databases:")
            for db in databases:
                print(f"  - {db[0]}")
            
            cursor.close()
            connection.close()
            print("\n✓ Database setup completed successfully!")
            print("\nNext steps:")
            print("1. Run: python manage.py makemigrations")
            print("2. Run: python manage.py migrate")
            print("3. Run: python populate_food_courts.py")
            
    except Error as e:
        print(f"✗ Error: {e}")
        print("\nTroubleshooting:")
        print("1. Make sure MySQL server is running")
        print("2. Check if the password is correct")
        print("3. Verify MySQL is installed and accessible")

if __name__ == '__main__':
    create_database()
