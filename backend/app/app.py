from flask import Flask, request, jsonify
from inference_sdk import InferenceHTTPClient
import base64
import tempfile
from dotenv import load_dotenv
import os
from PIL import Image
from cards import CARD_VALUE, BASIC_STRATEGY, CARD_TO_INT

load_dotenv(".env")

app = Flask(__name__)
app.config['DEBUG'] = True

@app.route('/')
def home():
    return "Hello, Flask!"

def split_image_horizontally(image_path):
    with Image.open(image_path) as img:
        width, height = img.size
        # Calculate the middle point for horizontal splitting
        mid_point = height // 2
        # Split the image into top and bottom halves
        top_half = img.crop((0, 0, width, mid_point))
        bottom_half = img.crop((0, mid_point, width, height))
        top_half.save('top_half.jpg')
        bottom_half.save('bottom_half.jpg')
        return top_half, bottom_half

@app.route('/action', methods=["POST"])
def action():
    res = predict()
    dealer = []
    for pred in res[0]["predictions"]:
        if pred["class"] not in dealer:
            dealer.append(pred["class"])
    player = []
    for pred in res[1]["predictions"]:
        if pred["class"] not in player:
            player.append(pred["class"])

    dealer = [s[:-1] for s in dealer]
    player = [s[:-1] for s in player]
    print("dealer", dealer)
    print("player", player)

    if len(dealer) == 0 or len(player) < 2:
        return jsonify({"error": "not enough cards"})
    
    return _action(dealer, player)
    
def _action(dealer_raw, player_raw):
    if len(dealer_raw) != 1:
        return jsonify({"error": "Dealer has more than one card"}), 400
    dealer_raw = dealer_raw[0]
    # # Get JSON data from the request
    # data = request.get_json()
    # player = data.get("player")
    # dealer = data.get("dealer")
    # soft = data.get("soft", False)  # Default to False if not provided
    # pair = data.get("pair", False)  # Default to False if not provided
    pair = False
    soft = False

    dealer = CARD_TO_INT[dealer_raw] if dealer_raw != "A" else "A"
    player = 0

    if (len(player_raw) == 2) and player_raw[0] == player_raw[1]:
        pair = True
        player = CARD_TO_INT[player_raw[0]] if player_raw != "A" else "A"
    else: 
        for card in player_raw:
            player += CARD_TO_INT[card]

            if card == 'A':
                soft = True
        if soft and player <= 11:
            player += 10
        else:
            soft = False
    
    if player >= 21:
        return jsonify({"error": "Player over 21 detected"}), 400
        

    # Determine which part of the strategy to use
    if pair:
        # Look up pairs
        if (player, player) in BASIC_STRATEGY["pairs"]:
            action_result = BASIC_STRATEGY["pairs"][(player, player)][dealer]
            if player == 'A':
                player = 12
            else:
                player += player
        else:
            action_result = "H"  # Default to Hit if pair not found
    elif soft:
        # Look up soft totals
        soft_key = f"A{player - 11}"  # Convert total to soft hand key (e.g., A2 for soft 13)
        if soft_key in BASIC_STRATEGY["soft_totals"]:
            action_result = BASIC_STRATEGY["soft_totals"][soft_key][dealer]
        else:
            action_result = "H"  # Default to Hit if soft hand not found
    else:
        # Look up hard totals
        if player in BASIC_STRATEGY["hard_totals"]:
            action_result = BASIC_STRATEGY["hard_totals"][player][dealer]
        else:
            action_result = "S"  # Default to Stand if hard total not found

    if dealer == 'A':
        dealer = 11
    # Return the action as JSON
    return jsonify({"action": action_result, "player_total": player, "dealer_total": dealer})

def predict():

    data = request.json['data']

    bytes = base64.b64decode(data)
    
    with tempfile.NamedTemporaryFile(delete=False, suffix='.jpg') as tmp_file:
        tmp_file.write(bytes)
        # Split the image horizontally
        top_half, bottom_half = split_image_horizontally(tmp_file.name)
        
        # Save the halves to temporary files
        top_path = tempfile.mktemp(suffix='.jpg')
        bottom_path = tempfile.mktemp(suffix='.jpg')
        top_half.save(top_path)
        bottom_half.save(bottom_path)
        
        # Initialize the Roboflow client
        CLIENT = InferenceHTTPClient(
            api_url="https://detect.roboflow.com",
            api_key=os.getenv('ROBOFLOW_KEY')
        )
        
        # Process each half
        results = []
        for half_path in [top_path, bottom_path]:
            result = CLIENT.infer(half_path, model_id="playing-cards-ow27d/4")
            results.append(result)
            os.remove(half_path)  # Clean up the temporary file
        
        os.remove(tmp_file.name)  # Clean up the original temporary file
    
    return results

@app.route('/run-count', methods=["POST"])
def apiTest():
    results = predict()

    predictions = []
    for res in results:
        for pred in res["predictions"]:
            if pred["class"] not in predictions:
                predictions.append(pred["class"])

    predictions = [s[:-1] for s in predictions]
    count = 0
    for card in predictions:
        count += CARD_VALUE[card]
    print("cards", predictions)
    return {"count": count}

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8000)