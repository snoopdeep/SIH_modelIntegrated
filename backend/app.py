from flask import Flask, request, jsonify
import cv2 as cv
import numpy as np
import mediapipe as mp
from collections import deque, Counter
import itertools
import copy
from model import KeyPointClassifier, PointHistoryClassifier
import csv
from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import dlib
import numpy as np
from scipy.spatial import distance as dist
import subprocess
import os
import time
from celery import Celery, states
from celery.result import AsyncResult
from demo import load_liveness_model, process_video  # Import from demo.py
import mediapipe as mp
from flask import Flask, request, jsonify
import cv2 as cv
import mediapipe as mp
from collections import deque, Counter
import itertools
import copy
from model import KeyPointClassifier, PointHistoryClassifier
import csv

app = Flask(__name__)
# # Enable CORS for all routes
CORS(app)  # This allows all routes to be accessible from any origin

# Initialize MediaPipe Hands model
mp_hands = mp.solutions.hands
hands = mp_hands.Hands(
    static_image_mode=True,
    max_num_hands=2,  # Detect up to two hands
    min_detection_confidence=0.7,
    min_tracking_confidence=0.5
)

# Load custom classifiers
keypoint_classifier = KeyPointClassifier()
point_history_classifier = PointHistoryClassifier()

# Read labels from CSV files
with open('model/keypoint_classifier/keypoint_classifier_label.csv', encoding='utf-8-sig') as f:
    keypoint_classifier_labels = [row[0] for row in csv.reader(f)]

with open('model/point_history_classifier/point_history_classifier_label.csv', encoding='utf-8-sig') as f:
    point_history_classifier_labels = [row[0] for row in csv.reader(f)]

# Initialize variables for point history and gesture history
history_length = 16
point_history = deque(maxlen=history_length)
finger_gesture_history = deque(maxlen=history_length)

@app.route('/detect', methods=['POST'])
def detect_movement():
    print("Received request to /detect")
    
    try:
        if 'image_0' not in request.files:
            return jsonify({"error": "No files provided"}), 400
        
        frames = []
        for key in request.files:
            file = request.files[key].read()
            npimg = np.frombuffer(file, np.uint8)
            img = cv.imdecode(npimg, cv.IMREAD_COLOR)
            frames.append(img)

        detected_movements = []

        for image in frames:
            image = cv.flip(image, 1)  # Mirror display
            debug_image = copy.deepcopy(image)

            image_rgb = cv.cvtColor(image, cv.COLOR_BGR2RGB)
            image_rgb.flags.writeable = False
            results = hands.process(image_rgb)
            image_rgb.flags.writeable = True

            if results.multi_hand_landmarks:
                for hand_landmarks, handedness in zip(results.multi_hand_landmarks, results.multi_handedness):
                    # Determine if it's left or right hand
                    hand_side = "Left" if handedness.classification[0].label == "Left" else "Right"
                    
                    brect = calc_bounding_rect(debug_image, hand_landmarks)
                    landmark_list = calc_landmark_list(debug_image, hand_landmarks)

                    pre_processed_landmark_list = pre_process_landmark(landmark_list)
                    hand_sign_id = keypoint_classifier(pre_processed_landmark_list)
                    
                    if hand_sign_id == 2:  # Assuming 2 is the ID for pointing gesture
                        point_history.append(landmark_list[8])
                    else:
                        point_history.append([0, 0])

                    pre_processed_point_history_list = pre_process_point_history(debug_image, point_history)
                    if len(pre_processed_point_history_list) == history_length * 2:
                        finger_gesture_id = point_history_classifier(pre_processed_point_history_list)
                        finger_gesture_history.append(finger_gesture_id)
                        most_common_fg_id = Counter(finger_gesture_history).most_common(1)[0][0]

                        detected_movements.append({
                            'hand_side': hand_side,
                            'hand_sign': f"{hand_side}: {keypoint_classifier_labels[hand_sign_id]}",
                            'finger_gesture': f"{hand_side}: {point_history_classifier_labels[most_common_fg_id]}"
                        })
                    else:
                        detected_movements.append({
                            'hand_side': hand_side,
                            'hand_sign': f"{hand_side}: {keypoint_classifier_labels[hand_sign_id]}",
                            'finger_gesture': f"{hand_side}: No Gesture"
                        })
            else:
                point_history.append([0, 0])
                detected_movements.append({'hand_side': 'None', 'hand_sign': 'No Hand', 'finger_gesture': 'No Gesture'})

        # print(detected_movements)
        return jsonify({"movements": detected_movements})

    except Exception as e:
        print(f"Error processing frames: {e}")
        return jsonify({"error": "An error occurred while processing the frames."}), 500

def calc_bounding_rect(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]
    landmark_array = np.array([(int(landmark.x * image_width), int(landmark.y * image_height)) for landmark in landmarks.landmark])
    x, y, w, h = cv.boundingRect(landmark_array)
    return [x, y, x + w, y + h]

def calc_landmark_list(image, landmarks):
    image_width, image_height = image.shape[1], image.shape[0]
    return [(min(int(landmark.x * image_width), image_width - 1),
             min(int(landmark.y * image_height), image_height - 1))
            for landmark in landmarks.landmark]

def pre_process_landmark(landmark_list):
    temp_landmark_list = copy.deepcopy(landmark_list)
    base_x, base_y = temp_landmark_list[0]
    temp_landmark_list = [(x - base_x, y - base_y) for (x, y) in temp_landmark_list]
    temp_landmark_list = list(itertools.chain.from_iterable(temp_landmark_list))
    max_value = max(list(map(abs, temp_landmark_list)))
    return [n / max_value for n in temp_landmark_list]

def pre_process_point_history(image, point_history):
    image_width, image_height = image.shape[1], image.shape[0]
    
    if not point_history or len(point_history[0]) != 2:
        return []

    temp_point_history = copy.deepcopy(point_history)
    base_x, base_y = temp_point_history[0]
    
    processed_x = [(x - base_x) / image_width for (x, y) in temp_point_history]
    processed_y = [(y - base_y) / image_height for (x, y) in temp_point_history]
    
    processed_point_history = list(itertools.chain.from_iterable(zip(processed_x, processed_y)))
    
    return processed_point_history




# Global variables to hold the loaded models
net = None
model = None
le = None

def initialize_model():
    global net, model, le
    print("Loading model...")
    net, model, le = load_liveness_model(
        model_path="C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\liveness1.keras",
        le_path="C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\le.pickle",
        detector_path="C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend",
        shape_predictor_path="C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\shape_predictor"
    )
    print("Model loaded successfully.")

@app.route('/initialize_model', methods=['GET'])
def initialize_model_endpoint():
    global net, model, le
    if net is None or model is None or le is None:
        initialize_model()
        return jsonify({"message": "Model initialized successfully."}), 200
    return jsonify({"message": "Model already initialized."}), 200

@app.route('/process_video', methods=['POST'])
def process_video_endpoint():
    global net, model, le
    
    if net is None or model is None or le is None:
        return jsonify({"error": "Model not loaded yet. Please initialize the model first."}), 400

    if 'video' not in request.files:
        return jsonify({"error": "No video file provided."}), 400

    video_file = request.files['video']
    if not video_file:
        return jsonify({"error": "No file part in the request."}), 400

    video_file_path = 'input_video.mp4'
    video_file.save(video_file_path)

    output_file_path = "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
    process_video(
        video_path=video_file_path,
        net=net,
        model=model,
        le=le,
        shape_predictor_path="C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\shape_predictor",
        output_path=output_file_path
    )

    if os.path.exists(output_file_path):
        with open(output_file_path, 'r') as file:
            output_content = file.read().strip()
        return jsonify({"message": "Liveness check completed.", "output": output_content})

    return jsonify({"error": "Liveness check failed to produce output"}), 500
if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
