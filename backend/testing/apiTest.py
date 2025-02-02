import os
import requests

url = 'http://127.0.0.1:8000/run-count'
files = {'image': open('./image.jpg', 'rb')}  # Ensure image path is correct

response = requests.post(url, files=files)

# Properly print the response
print(response.status_code)  # Prints HTTP status code (e.g., 200, 400, 500)
print(response.text)  # Prints the actual response data (JSON or error message)
