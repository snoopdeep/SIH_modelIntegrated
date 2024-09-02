

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import cv2
import dlib
import numpy as np
from scipy.spatial import distance as dist
import subprocess
import os

app = Flask(__name__)

# Enable CORS for all routes
CORS(app)  # This allows all routes to be accessible from any origin

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

# @app.route('/livenesscheck', methods=['POST'])
# def liveness_check():
#     print("Received request to /livenesscheck")  # Log to ensure route is being accessed
    
#     try:
#         # Define the command to run demo.py with all required arguments
#         command = [
#             "python", "demo.py",
#             "-m", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\liveness1.keras",
#             "-l", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\le.pickle",
#             "-d", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend",
#             "-p", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\shape_predictor",
#             "-o", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
#         ]

#         # Run the command and wait for 5 seconds
#         process = subprocess.Popen(command)
#         process.wait(timeout=5)  # Run the process for 5 seconds

#         # Check if output file is created
#         output_file_path = "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
#         if os.path.exists(output_file_path):
#             return send_file(output_file_path, as_attachment=True)

#         return jsonify({"error": "Liveness check failed to produce output"}), 500

#     except subprocess.TimeoutExpired:
#         print("Process took too long and was terminated.")
#         return jsonify({"error": "Liveness check process took too long"}), 500
#     except Exception as e:
#         print(f"Error during liveness check: {e}")
#         return jsonify({"error": "An error occurred during liveness check"}), 500

# @app.route('/livenesscheck', methods=['POST'])
# def liveness_check():
#     print("Received request to /livenesscheck")  # Log to ensure route is being accessed
    
#     try:
#         # Define the command to run demo.py with all required arguments
#         command = [
#             "python", "demo.py",
#             "-m", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\liveness1.keras",
#             "-l", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\le.pickle",
#             "-d", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend",
#             "-p", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\shape_predictor",
#             "-o", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
#         ]

#         # Run the command and wait for 5 seconds
#         process = subprocess.Popen(command)
#         process.wait(timeout=10)  # Run the process for 5 seconds

#         # Terminate the process to close the webcam
#         process.terminate()

#         # Check if output file is created
#         output_file_path = "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
#         if os.path.exists(output_file_path):
#             with open(output_file_path, 'r') as file:
#                 output_content = file.read()
#             return jsonify({"message": "Liveness check completed.", "output": output_content})

#         return jsonify({"error": "Liveness check failed to produce output"}), 500

#     except subprocess.TimeoutExpired:
#         print("Process took too long and was terminated.")
#         return jsonify({"error": "Liveness check process took too long"}), 500
#     except Exception as e:
#         print(f"Error during liveness check: {e}")
#         return jsonify({"error": "An error occurred during liveness check"}), 500


# @app.route('/livenesscheck', methods=['POST'])
# def liveness_check():
#     print("Received request to /livenesscheck")  # Log to ensure route is being accessed

#     try:
#         # Define the command to run demo.py with all required arguments
#         command = [
#             "python", "demo.py",
#             "-m", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\liveness1.keras",
#             "-l", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\le.pickle",
#             "-d", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend",
#             "-p", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\shape_predictor",
#             "-o", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
#         ]

#         # Run the command and wait for 5 seconds
#         process = subprocess.Popen(command)
#         try:
#             process.wait(timeout=30)  # Adjust timeout as needed based on your model loading time
#         except subprocess.TimeoutExpired:
#             print("Process took too long and was terminated.")
#             process.terminate()
#             process.wait()  # Ensure the process is completely terminated
#             return jsonify({"error": "Liveness check process took too long"}), 500

#         # Check if output file is created
#         output_file_path = "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
#         if os.path.exists(output_file_path):
#             with open(output_file_path, 'r') as file:
#                 output_content = file.read()
#             return jsonify({"message": "Liveness check completed.", "output": output_content})

#         return jsonify({"error": "Liveness check failed to produce output"}), 500

#     except Exception as e:
#         print(f"Error during liveness check: {e}")
#         return jsonify({"error": "An error occurred during liveness check"}), 500

@app.route('/livenesscheck', methods=['POST'])
def liveness_check():
    print("Received request to /livenesscheck")  # Log to ensure route is being accessed

    try:
        # Define the command to run demo.py with all required arguments
        command = [
            "python", "demo.py",
            "-m", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\liveness1.keras",
            "-l", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\le.pickle",
            "-d", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend",
            "-p", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\shape_predictor",
            "-o", "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
        ]

        # Run the command and wait for it to complete
        process = subprocess.Popen(command, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        try:
            stdout, stderr = process.communicate(timeout=30)  # Adjust timeout as needed based on your model loading time
        except subprocess.TimeoutExpired:
            print("Process took too long and was terminated.")
            process.terminate()
            process.wait()  # Ensure the process is completely terminated
            return jsonify({"error": "Liveness check process took too long"}), 500

        # Check for errors in subprocess execution
        if process.returncode != 0:
            print(f"Error during liveness check process: {stderr.decode('utf-8')}")
            return jsonify({"error": f"Error running demo.py: {stderr.decode('utf-8')}"}), 500

        # Check if output file is created
        output_file_path = "C:\\Users\\Deepak Singh\\OneDrive\\Desktop\\SIH\\backend\\output.txt"
        if os.path.exists(output_file_path):
            with open(output_file_path, 'r') as file:
                output_content = file.read().strip()  # Strip to remove any unnecessary whitespace or newlines
            return jsonify({"message": "Liveness check completed.", "output": output_content})

        # If output file was not created, return an error
        print("Liveness check failed to produce output")
        return jsonify({"error": "Liveness check failed to produce output"}), 500

    except Exception as e:
        print(f"Error during liveness check: {e}")
        return jsonify({"error": "An error occurred during liveness check: " + str(e)}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000, debug=True)
