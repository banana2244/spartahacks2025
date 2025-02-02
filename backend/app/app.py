from flask import Flask, request, jsonify
from inference_sdk import InferenceHTTPClient
# from flask_cors import CORS
import base64
import tempfile
from dotenv import load_dotenv
import os
load_dotenv(".env")


app = Flask(__name__)
# CORS(app)


app.config['DEBUG'] = True

    
@app.route('/')
def home():
    return "Hello, Flask!"

@app.route('/run-count', methods=["POST"])
def apiTest():
    if "image" not in request.files:
        return jsonify({'error': 'No file part'}), 400
    
    file = request.files["image"]
    
    with tempfile.NamedTemporaryFile(delete=False) as tmp_file:
        file.save(tmp_file.name)
        CLIENT = InferenceHTTPClient(
            api_url="https://detect.roboflow.com",
            api_key=os.getenv('ROBOFLOW_KEY')
        )
        result = CLIENT.infer(tmp_file.name, model_id="playing-cards-ow27d/4")
        os.remove(tmp_file.name)
    return jsonify(result)




if __name__ == '__main__':
    app.run(debug=True, host="127.0.0.1", port=8000)