from flask import Flask, request, jsonify
import base64
import tempfile
from dotenv import load_dotenv
import os
from PIL import Image
from cards import CARD_VALUE, BASIC_STRATEGY

from ultralytics import YOLO

load_dotenv(".env")

app = Flask(__name__)
app.config['DEBUG'] = True



###############
# MODEL SETUP #
###############
# Integrates with the card classification model at https://github.com/TeogopK/Playing-Cards-Object-Detection/tree/main
# This is the most diabolical integration I have ever done
# This repo relies on the model's repo to be next to it in the file structure, and traverses to it to get the weights


import math
import sys
from ultralytics import YOLO
import cv2

# Change to 'tuned' to use it as the default one
DEFAULT_MODEL = "synthetic"
SHOW_CONFIDENCE = False

configuration_dict = {
    "synthetic": {
        "model_path": "../../../Playing-Cards-Object-Detection/final_models/yolov8m_synthetic.pt",
        "class_names": [
            "10c",
            "10d",
            "10h",
            "10s",
            "2c",
            "2d",
            "2h",
            "2s",
            "3c",
            "3d",
            "3h",
            "3s",
            "4c",
            "4d",
            "4h",
            "4s",
            "5c",
            "5d",
            "5h",
            "5s",
            "6c",
            "6d",
            "6h",
            "6s",
            "7c",
            "7d",
            "7h",
            "7s",
            "8c",
            "8d",
            "8h",
            "8s",
            "9c",
            "9d",
            "9h",
            "9s",
            "Ac",
            "Ad",
            "Ah",
            "As",
            "Jc",
            "Jd",
            "Jh",
            "Js",
            "Kc",
            "Kd",
            "Kh",
            "Ks",
            "Qc",
            "Qd",
            "Qh",
            "Qs",
        ],
    },
    "tuned": {
        "model_path": "../final_models/yolov8m_tuned.pt",
        "class_names": ["10h", "2h", "3h", "4h", "5h", "6h", "7h", "8h", "9h", "Ah", "Jh", "Kh", "Qh"],
    },
}

# Card values mapping
card_values = {
    "2c": 2,
    "2d": 2,
    "2h": 2,
    "2s": 2,
    "3c": 3,
    "3d": 3,
    "3h": 3,
    "3s": 3,
    "4c": 4,
    "4d": 4,
    "4h": 4,
    "4s": 4,
    "5c": 5,
    "5d": 5,
    "5h": 5,
    "5s": 5,
    "6c": 6,
    "6d": 6,
    "6h": 6,
    "6s": 6,
    "7c": 7,
    "7d": 7,
    "7h": 7,
    "7s": 7,
    "8c": 8,
    "8d": 8,
    "8h": 8,
    "8s": 8,
    "9c": 9,
    "9d": 9,
    "9h": 9,
    "9s": 9,
    "10c": 10,
    "10d": 10,
    "10h": 10,
    "10s": 10,
    "Ac": 1,
    "Ad": 1,
    "Ah": 1,
    "As": 1,
    "Jc": 10,
    "Jd": 10,
    "Jh": 10,
    "Js": 10,
    "Kc": 10,
    "Kd": 10,
    "Kh": 10,
    "Ks": 10,
    "Qc": 10,
    "Qd": 10,
    "Qh": 10,
    "Qs": 10,
}

print("Loading application...")

configuration_model = sys.argv[1] if len(sys.argv) >= 2 else DEFAULT_MODEL

if configuration_model not in configuration_dict.keys():
    print(f"Allowed parameters for model are {configuration_dict.keys()}. Defaulting to {DEFAULT_MODEL}...")
    configuration_model = DEFAULT_MODEL

current_config = configuration_dict.get(configuration_model)

# Load the model and class names
model = YOLO(current_config["model_path"])
classNames = current_config["class_names"]

def classifyImage(image):
    results = model(image, stream=True)
    
    out = []
    total = 0
    for r in results:
        print(f"Result: {r}")
        boxes = r.boxes
        for box in boxes:
            cls = int(box.cls[0])
            className = classNames[cls]
            total += card_values.get(className, 0)
            out.append(className)
    
    return out, total


# Attempts to remove duplicate detections of the same card (since cards have two numbers)
def cleanCards(cards):
    # Try to remove duplicates
    totals = {}
    for card in cards:
        if card in totals.keys():
            totals[card] += 1
        else:
            totals[card] = 1

    # Calculate number of cards to remove
    toRemove = {}
    for card in totals:
        toRemove[card] = totals[card] // 2

    # Remove "duplicates"
    for card in toRemove:
        for i in range(toRemove[card]):
            cards.remove(card)

    # Remove suite
    cleaned = []
    for card in cards:
        card = card.replace('s', '').replace('h', '').replace('d', '').replace('c', '')
        cleaned.append(card)

    return cleaned

##########
# ROUTES #
##########


@app.route('/')
def home():
    return "Hello, Flask!"

def split_image_horizontally(image_path):
    with Image.open(image_path) as img:
        width, height = img.size

        if(width > height):
            img = img.rotate(-90)
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
            player = [].append(pred["class"])

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

        topCards, topTotal = classifyImage(top_half)
        
        botCards, botTotal = classifyImage(bottom_half)

        # Process each half
        for half_path in [top_path, bottom_path]:
            os.remove(half_path)  # Clean up the temporary file
        
        os.remove(tmp_file.name)  # Clean up the original temporary file

    print("RAW CARDS")  
    print(f"Top total: {topTotal}, Cards: {topCards}")
    print(f"Bottom total: {botTotal}, Cards: {botCards}")

    # Try to remove duplicates
    topCards = cleanCards(topCards)
    botCards = cleanCards(botCards)

    print("CLEANED CARDS")
    print(f"Top total: {topTotal}, Cards: {topCards}")
    print(f"Bottom total: {botTotal}, Cards: {botCards}")

    out = []
    out[0]["predictions"] = topCards
    out[0]["total"] = topTotal
    out[1]["predictions"] = botCards
    out[1]["total"] = botTotal   
    return out

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
    return {"count": count, "num_cards": len(predictions)}

if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8000)