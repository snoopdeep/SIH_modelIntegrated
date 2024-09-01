from flask import Flask, request, jsonify
import cv2
import numpy as np
from movement import detect_nose, draw_controller, log_movement, reset_press_flag

app = Flask(__name__)
from flask_cors import CORS
CORS(app)

faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')

@app.route('/detect', methods=['POST'])
def detect_movement():
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
    return jsonify({"liveness": detected_movements})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
