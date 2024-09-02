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


from flask import Flask, request, jsonify
from flask_cors import CORS
import cv2
import numpy as np
from movement import detect_nose, draw_controller, log_movement, reset_press_flag

app = Flask(__name__)
CORS(app, resources={r"/detect": {"origins": "*"}})  # Allow all origins for /detect route

faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

@app.route('/detect', methods=['POST'])
def detect_movement():
    print("Received request to /detect")  # Log to ensure route is being accessed
    try:
        # Check if files are present in the request
        if 'image_0' not in request.files:
            return jsonify({"error": "No files provided"}), 400
        
        # Collect frames from the request
        frames = []
        for key in request.files:
            file = request.files[key].read()
            npimg = np.frombuffer(file, np.uint8)
            img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)
            frames.append(img)

        # Initialize movement detection variables
        prev_nose_cords = None
        detected_movements = []
        cmd = ""

        # Process each frame
        for img in frames:
            img, nose_cords = detect_nose(img, faceCascade)
            cords = draw_controller(img, (int(img.shape[1] / 2), int(img.shape[0] / 2)))
            if len(nose_cords):
                cmd = log_movement(nose_cords, cords, cmd, prev_nose_cords)
                prev_nose_cords = nose_cords

            detected_movements.append(cmd)

        # Return detected movements for all frames
        return jsonify({"movement": detected_movements})

    except Exception as e:
        print(f"Error processing frames: {e}")
        return jsonify({"error": "An error occurred while processing the frames."}), 500

if __name__ == '__main__':
    print("Starting Flask server...")
    app.run(host='0.0.0.0', port=5000)
