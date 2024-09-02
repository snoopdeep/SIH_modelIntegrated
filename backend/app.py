# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from movement import detect_nose, draw_controller, log_movement, reset_press_flag

# app = Flask(__name__)
# from flask_cors import CORS
# CORS(app)

# faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# @app.route('/detect', methods=['POST'])
# def detect_movement():
#     # Collect frames from the request
#     frames = []
#     for key in request.files:
#         file = request.files[key].read()
#         npimg = np.frombuffer(file, np.uint8)
#         img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
#         frames.append(img)

#     # Initialize movement detection variables
#     prev_nose_cords = None
#     detected_movements = []
#     cmd = ""

#     # Process each frame
#     for img in frames:
#         img, nose_cords = detect_nose(img, faceCascade)
#         cords = draw_controller(img, (int(img.shape[1] / 2), int(img.shape[0] / 2)))
#         if len(nose_cords):
#             cmd = log_movement(nose_cords, cords, cmd, prev_nose_cords)
#             prev_nose_cords = nose_cords

#         detected_movements.append(cmd)

#     # Return detected movements for all frames
#     return jsonify({"movement": detected_movements})

# if __name__ == '__main__':
#     app.run(host='0.0.0.0', port=5000)

# from flask import Flask, request, jsonify
# import cv2
# import numpy as np
# from movement import detect_nose, draw_controller, log_movement, reset_press_flag
# from flask_cors import CORS

# app = Flask(__name__)
# CORS(app)

# faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# @app.route('/detect', methods=['POST'])
# def detect_movement():
#     print("Received request to /detect")  # Log to ensure route is being accessed
#     try:
#         # Check if files are present in the request
#         if 'image_0' not in request.files:
#             return jsonify({"error": "No files provided"}), 400
        
#         # Collect frames from the request
#         frames = []
#         for key in request.files:
#             file = request.files[key].read()
#             npimg = np.frombuffer(file, np.uint8)
#             img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
#             frames.append(img)

#         # Initialize movement detection variables
#         prev_nose_cords = None
#         detected_movements = []
#         cmd = ""

#         # Process each frame
#         for img in frames:
#             img, nose_cords = detect_nose(img, faceCascade)
#             cords = draw_controller(img, (int(img.shape[1] / 2), int(img.shape[0] / 2)))
#             if len(nose_cords):
#                 cmd = log_movement(nose_cords, cords, cmd, prev_nose_cords)
#                 prev_nose_cords = nose_cords

#             detected_movements.append(cmd)

#         # Return detected movements for all frames
#         return jsonify({"movement": detected_movements})

#     except Exception as e:
#         print(f"Error processing frames: {e}")
#         return jsonify({"error": "An error occurred while processing the frames."}), 500

# if __name__ == '__main__':
#     print("Starting Flask server...")
#     app.run(host='0.0.0.0', port=5000)


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import cv2
# import numpy as np
# from movement import detect_nose, draw_controller, log_movement, reset_press_flag

# app = Flask(__name__)
# CORS(app, resources={r"/detect": {"origins": "*"}})  # Allow all origins for /detect route

# faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

# @app.route('/detect', methods=['POST'])
# def detect_movement():
#     print("Received request to /detect")  # Log to ensure route is being accessed
#     try:
#         # Check if files are present in the request
#         if 'image_0' not in request.files:
#             return jsonify({"error": "No files provided"}), 400
        
#         # Collect frames from the request
#         frames = []
#         for key in request.files:
#             file = request.files[key].read()
#             npimg = np.frombuffer(file, np.uint8)
#             img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
#             frames.append(img)

#         # Initialize movement detection variables
#         prev_nose_cords = None
#         detected_movements = []
#         cmd = ""

#         # Process each frame
#         for img in frames:
#             img, nose_cords = detect_nose(img, faceCascade)
#             cords = draw_controller(img, (int(img.shape[1] / 2), int(img.shape[0] / 2)))
#             if len(nose_cords):
#                 cmd = log_movement(nose_cords, cords, cmd, prev_nose_cords)
#                 prev_nose_cords = nose_cords

#             detected_movements.append(cmd)

#         # Return detected movements for all frames
#         return jsonify({"movement": detected_movements})

#     except Exception as e:
#         print(f"Error processing frames: {e}")
#         return jsonify({"error": "An error occurred while processing the frames."}), 500

# if __name__ == '__main__':
#     print("Starting Flask server...")
#     app.run(host='0.0.0.0', port=5000)

# -----------


# from flask import Flask, request, jsonify
# from flask_cors import CORS
# import cv2
# import dlib
# import numpy as np
# from scipy.spatial import distance as dist
# from datetime import datetime

# app = Flask(__name__)
# CORS(app, resources={r"/detect": {"origins": "*"}})  # Allow all origins for /detect route

# # Initialize dlib's face detector (HOG-based) and facial landmark predictor
# detector = dlib.get_frontal_face_detector()
# predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')

# # Function to convert dlib shape object to numpy array
# def shape_to_np(shape, dtype="int"):
#     coords = np.zeros((68, 2), dtype=dtype)
#     for i in range(0, 68):
#         coords[i] = (shape.part(i).x, shape.part(i).y)
#     return coords

# # Function to detect the nose tip using dlib
# def detect_nose(img):
#     gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     rects = detector(gray, 1)

#     nose_cords = []
#     for rect in rects:
#         shape = predictor(gray, rect)
#         shape = shape_to_np(shape)
#         # Get the landmark for the nose tip (index 30)
#         nose_cords = (shape[30][0], shape[30][1])
#         cv2.circle(img, nose_cords, 10, (0, 255, 0), 2)  # Draw circle on the nose

#     return img, nose_cords

# # Function to draw controller
# def draw_controller(img, cords):
#     size = 20
#     x1 = cords[0] - size
#     y1 = cords[1] - size
#     x2 = cords[0] + size
#     y2 = cords[1] + size
#     cv2.circle(img, cords, size, (255, 0, 0), 2)
#     return [(x1, y1), (x2, y2)]

# # Function to log movement
# def log_movement(nose_cords, cords, cmd, prev_nose_cords):
#     try:
#         [(x1, y1), (x2, y2)] = cords
#         xc, yc = nose_cords
#     except Exception as e:
#         print(e)
#         return cmd

#     if xc < x1:
#         cmd = "left"
#     elif xc > x2:
#         cmd = "right"
#     elif yc < y1:
#         cmd = "up"
#     elif yc > y2:
#         cmd = "down"

#     if prev_nose_cords:
#         px, py = prev_nose_cords
#         angle = np.arctan2(yc - py, xc - px) * 180 / np.pi
#         if angle > 10:
#             cmd = "clockwise"
#         elif angle < -10:
#             cmd = "anticlockwise"

#     if cmd:
#         print("Detected movement: ", cmd, "\n")
#         with open("head_movements.txt", "a") as file:
#             file.write(f"{datetime.now()}: {cmd}\n")
    
#     return cmd

# @app.route('/detect', methods=['POST'])
# def detect_movement():
#     print("Received request to /detect")  # Log to ensure route is being accessed
#     try:
#         # Check if files are present in the request
#         if 'image_0' not in request.files:
#             return jsonify({"error": "No files provided"}), 400
        
#         # Collect frames from the request
#         frames = []
#         for key in request.files:
#             file = request.files[key].read()
#             npimg = np.frombuffer(file, np.uint8)
#             img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
#             frames.append(img)

#         # Initialize movement detection variables
#         prev_nose_cords = None
#         detected_movements = []
#         cmd = ""

#         # Process each frame
#         for img in frames:
#             img, nose_cords = detect_nose(img)
#             if nose_cords:  # Check if nose was detected
#                 cords = draw_controller(img, (int(img.shape[1] / 2), int(img.shape[0] / 2)))
#                 cmd = log_movement(nose_cords, cords, cmd, prev_nose_cords)
#                 prev_nose_cords = nose_cords

#             detected_movements.append(cmd)

#         # Return detected movements for all frames
#         return jsonify({"movement": detected_movements})

#     except Exception as e:
#         print(f"Error processing frames: {e}")
#         return jsonify({"error": "An error occurred while processing the frames."}), 500

# if __name__ == '__main__':
#     print("Starting Flask
# 
# 
#  server...")
#     app.run(host='0.0.0.0', port=5000)



# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import dlib
import numpy as np
from scipy.spatial import distance as dist

app = Flask(__name__)
CORS(app, resources={r"/detect": {"origins": "*"}})  # Allow all origins for /detect route

# Initialize dlib's face detector (HOG-based) and facial landmark predictor
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor('shape_predictor_68_face_landmarks.dat')

# Function to convert dlib shape object to numpy array
def shape_to_np(shape, dtype="int"):
    coords = np.zeros((68, 2), dtype=dtype)
    for i in range(0, 68):
        coords[i] = (shape.part(i).x, shape.part(i).y)
    return coords

# Function to calculate Eye Aspect Ratio (EAR)
def eye_aspect_ratio(eye):
    A = dist.euclidean(eye[1], eye[5])
    B = dist.euclidean(eye[2], eye[4])
    C = dist.euclidean(eye[0], eye[3])
    ear = (A + B) / (2.0 * C)
    return ear

# Indices for left and right eye landmarks
left_eye_indices = [36, 37, 38, 39, 40, 41]
right_eye_indices = [42, 43, 44, 45, 46, 47]

# Thresholds for blink detection
EAR_THRESHOLD = 0.25  # Threshold to detect eye closure
EAR_CONSEC_FRAMES = 2  # Number of consecutive frames below threshold to consider blink

@app.route('/detect', methods=['POST'])
def detect_movement():
    print("Received request to /detect")  # Log to ensure route is being accessed
    
    try:
        # Check if files are present in the request
        if 'image_0' not in request.files:
            return jsonify({"error": "No files provided"}), 400
        
        # Initialize variables for movement detection
        prev_landmarks = None
        blink_counter = 0
        action_counter = 0
        max_actions = 30
        detected_movements = []

        # Collect frames from the request
        frames = []
        for key in request.files:
            file = request.files[key].read()
            npimg = np.frombuffer(file, np.uint8)
            img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
            frames.append(img)

        # Process each frame
        for img in frames:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)  # Convert to grayscale
            rects = detector(gray, 1)  # Detect faces

            for rect in rects:
                shape = predictor(gray, rect)  # Predict facial landmarks
                shape = shape_to_np(shape)  # Convert to numpy array

                # Get the landmarks for the left and right eye
                left_eye = shape[left_eye_indices]
                right_eye = shape[right_eye_indices]

                # Calculate EAR for both eyes
                left_ear = eye_aspect_ratio(left_eye)
                right_ear = eye_aspect_ratio(right_eye)
                avg_ear = (left_ear + right_ear) / 2.0

                # Check for blink
                if avg_ear < EAR_THRESHOLD:
                    blink_counter += 1
                else:
                    if blink_counter >= EAR_CONSEC_FRAMES:
                        detected_movements.append('Blinking')
                        action_counter += 1
                    blink_counter = 0

                # Analyze movements
                if prev_landmarks is not None:
                    dx = shape[30][0] - prev_landmarks[30][0]  # X displacement of nose tip
                    dy = shape[30][1] - prev_landmarks[30][1]  # Y displacement of nose tip

                    # Determine movement direction
                    if dx > 10:
                        detected_movements.append('Right')
                        action_counter += 1
                    elif dx < -10:
                        detected_movements.append('Left')
                        action_counter += 1
                    if dy > 10:
                        detected_movements.append('Down')
                        action_counter += 1
                    elif dy < -10:
                        detected_movements.append('Up')
                        action_counter += 1

                # Update previous landmarks
                prev_landmarks = shape

            # Stop processing after capturing 30 actions
            if action_counter >= max_actions:
                break

        # Filter out any unintended or incorrect detections
        filtered_movements = [move for move in detected_movements if move in ['Blinking', 'Left', 'Right', 'Up', 'Down']]

        # Return filtered detected movements for all frames
        print(filtered_movements)
        return jsonify({"movements": filtered_movements})

    except Exception as e:
        print(f"Error processing frames: {e}")
        return jsonify({"error": "An error occurred while processing the frames."}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000)
