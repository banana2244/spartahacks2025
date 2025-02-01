from flask import Flask
# from dotenv import load_dotenv
import os



app = Flask(__name__)
# load_dotenv('env/.env')

app.config['DEBUG'] = True


@app.route('/')
def home():
    return "Hello, Flask!"

if __name__ == '__main__':
    app.run(debug=True)