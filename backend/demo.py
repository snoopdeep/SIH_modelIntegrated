import tensorflow as tf
import argparse
import cv2
import numpy as np
import os
import pickle
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.models import load_model
import signal
import sys

# Signal handler to release resources and exit gracefully
def signal_handler(sig, frame):
    print("Process interrupted. Releasing resources...")
    cv2.destroyAllWindows()
    sys.exit(0)

signal.signal(signal.SIGINT, signal_handler)
signal.signal(signal.SIGTERM, signal_handler)

def load_liveness_model(model_path, le_path, detector_path, shape_predictor_path):
    """Load the necessary models and encoders."""
    # Load face detector
    print("Loading face detector")
    protoPath = os.path.sep.join([detector_path, "deploy.prototxt"])
    modelPath = os.path.sep.join([detector_path, "res10_300x300_ssd_iter_140000.caffemodel"])
    net = cv2.dnn.readNetFromCaffe(protoPath, modelPath)

    # Load the liveness detection model
    print("Loading the liveness detector")
    model = load_model(model_path)

    # Load label encoder
    with open(le_path, "rb") as f:
        le = pickle.load(f)

    print("Models loaded successfully.")
    return net, model, le

def preprocess_image(face):
    """Preprocess the face image for prediction."""
    face = cv2.resize(face, (32, 32))
    face = face.astype("float32") / 255.0
    face = img_to_array(face)
    face = np.expand_dims(face, axis=0)
    return face

def process_video(video_path, net, model, le, shape_predictor_path, output_path):
    """Process the video and detect liveness."""
    # Start processing video
    video_capture = cv2.VideoCapture(video_path)
    if not video_capture.isOpened():
        print("Error: Could not open video file.")
        sys.exit(1)

    # Open the text file for writing results
    with open(output_path, "w") as file:
        try:
            while True:
                ret, frame = video_capture.read()
                if not ret:
                    break

                (h, w) = frame.shape[:2]
                blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
                net.setInput(blob)
                detections = net.forward()

                for i in range(0, detections.shape[2]):
                    confidence = detections[0, 0, i, 2]
                    if confidence > 0.5:  # Use fixed threshold
                        box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                        (startX, startY, endX, endY) = box.astype("int")
                        face = frame[startY:endY, startX:endX]

                        # Preprocess face image for liveness detection
                        face = preprocess_image(face)
                        preds = model(face)
                        preds = preds.numpy()
                        label_index = np.argmax(preds, axis=-1)[0]
                        confidence = preds[0][label_index]

                        adjusted_confidence = confidence * 1.512
                        label_text = "Real" if confidence > 0.5 else "Fake"
                        result = f"{label_text} ({adjusted_confidence:.4f}) - Box: ({startX}, {startY}, {endX}, {endY})\n"
                        file.write(result)
                        file.flush()

        except Exception as e:
            print(f"Error during processing: {e}")

        finally:
            video_capture.release()
            cv2.destroyAllWindows()
            print("Resources released. Exiting program.")
