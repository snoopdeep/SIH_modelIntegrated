from flask import Flask, request, jsonify
from flask_cors import CORS  # Import CORS
import cv2
import numpy as np
from keras.models import load_model
import pickle

# Initialize Flask app
app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Load the model and label encoder
model = load_model('liveness1.keras')
label_encoder = pickle.load(open('le.pickle', 'rb'))

@app.route('/detect', methods=['POST'])
def detect_liveness():
    if 'image' not in request.files:
        return jsonify({"error": "No image file provided"}), 400

    image_file = request.files['image']
    image = cv2.imdecode(np.frombuffer(image_file.read(), np.uint8), cv2.IMREAD_COLOR)
    
    # Preprocess the image: Resize to (32, 32) and normalize
    image = cv2.resize(image, (32, 32))  # Resize to match model input shape
    image = image.astype('float32') / 255.0  # Normalize to [0, 1] range
    image = np.expand_dims(image, axis=0)  # Add batch dimension

    # Use your model to predict liveness
    prediction = model.predict(image)

    # Convert the prediction to readable format
    label = label_encoder.inverse_transform([np.argmax(prediction)])[0]

    return jsonify({"liveness": label})


if __name__ == '__main__':
    app.run(debug=True)
