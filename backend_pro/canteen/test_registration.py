import requests
import json

# Test registration
url = 'http://127.0.0.1:8000/api/auth/register/'
data = {
    'username': 'testuser123',
    'email': 'testuser123@example.com',
    'password': 'test123',
    'first_name': 'Test',
    'last_name': 'User',
    'phone': '1234567890',
    'role': 'student'
}

print("Testing registration endpoint...")
print(f"URL: {url}")
print(f"Data: {json.dumps(data, indent=2)}")
print()

try:
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 201:
        print("\n✓ Registration successful!")
        result = response.json()
        print(f"User ID: {result['user']['id']}")
        print(f"Username: {result['user']['username']}")
        print(f"Role: {result['user']['role']}")
        print(f"Wallet Balance: {result['user']['wallet_balance']}")
    else:
        print("\n✗ Registration failed!")
        try:
            errors = response.json()
            print("Errors:")
            for field, messages in errors.items():
                print(f"  {field}: {messages}")
        except:
            pass
            
except Exception as e:
    print(f"✗ Error: {str(e)}")

print("\n" + "="*50)

# Test login
print("\nTesting login endpoint...")
login_url = 'http://127.0.0.1:8000/api/auth/login/'
login_data = {
    'username': 'student1',
    'password': 'student123'
}

print(f"URL: {login_url}")
print(f"Data: {json.dumps(login_data, indent=2)}")
print()

try:
    response = requests.post(login_url, json=login_data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
    
    if response.status_code == 200:
        print("\n✓ Login successful!")
        result = response.json()
        print(f"Username: {result['user']['username']}")
        print(f"Role: {result['user']['role']}")
        print(f"Access Token: {result['access'][:50]}...")
    else:
        print("\n✗ Login failed!")
        
except Exception as e:
    print(f"✗ Error: {str(e)}")
