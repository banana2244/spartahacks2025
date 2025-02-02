import os
import time
import requests

url = 'http://127.0.0.1:8000/action'
url2 = 'http://127.0.0.1:8000/run-count'
files = {'image': open('./img_4.jpg', 'rb')}  # Ensure image path is correct

response = requests.post(url, files=files)

# Properly print the response
print(response.status_code)  # Prints HTTP status code (e.g., 200, 400, 500)
print(response.text)  # Prints the actual response data (JSON or error message)

response = requests.post(url2, files={'image': open('./img_4.jpg', 'rb')})


# Properly print the response
print(response.status_code)  # Prints HTTP status code (e.g., 200, 400, 500)
print(response.text)  # Prints the actual response data (JSON or error message)
