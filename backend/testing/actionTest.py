import requests

# Define the URL of the Flask app
url = 'http://127.0.0.1:8000/action'

# Define the JSON payload for the request
payload = {
    "player": 15,  # Player's total
    "dealer": 10,  # Dealer's upcard
    "soft": False,  # Whether the hand is soft
    "pair": False   # Whether the hand is a pair
}

# Send the POST request
response = requests.post(url, json=payload)

# Print the response details
print(response.status_code)  # Prints HTTP status code (e.g., 200, 400, 500)
print(response.json())       # Prints the JSON response data