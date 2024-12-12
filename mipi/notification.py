import requests
import json

# Your Firebase Realtime Database URL (replace with your actual URL)
firebase_url = "https://your-database-name.firebaseio.com/"

# Data to write to Firebase (Example dictionary)
data = {
    'name': 'John Doe',
    'age': 30,
    'city': 'New York'
}

# Write data to Firebase Realtime Database
def write_data():
    # The reference 'users/1' will store the data at that location in the database
    url = f"https://sihapp-d06f1-default-rtdb.firebaseio.com/"
    response = requests.put(url, json=data)
    if response.status_code == 200:
        print("Data written successfully!")
    else:
        print("Failed to write data:", response.status_code)

# Read data from Firebase Realtime Database
def read_data():
    # The reference 'users/1' to fetch data from Firebase
    url = f"https://sihapp-d06f1-default-rtdb.firebaseio.com/"
    response = requests.get(url)
    if response.status_code == 200:
        user_data = response.json()  # Parse the JSON response
        print("Data read from Firebase:", json.dumps(user_data, indent=4))
    else:
        print("Failed to read data:", response.status_code)

# Example Usage
write_data()  # Write data to Firebase
read_data()  # Read data from Firebase