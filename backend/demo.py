# import tensorflow as tf
# import argparse
# import cv2
# import numpy as np
# import os
# import pickle
# from tensorflow.keras.preprocessing.image import img_to_array
# from tensorflow.keras.models import load_model  # Import the correct function

# # Load the liveness detection model using Keras model loader

# # Construct argument parse and parse the arguments
# ap = argparse.ArgumentParser()
# ap.add_argument("-m", "--model", type=str, required=True, help="path to trained model")
# ap.add_argument("-l", "--le", type=str, required=True, help="path to label encoder")
# ap.add_argument("-d", "--detector", type=str, required=True, help="path to OpenCV's deep learning face detector")
# ap.add_argument("-c", "--confidence", type=float, default=0.5, help="minimum probability to filter weak detections")
# ap.add_argument("-p", "--shape-predictor", required=True, help="path to facial landmark predictor")
# args = vars(ap.parse_args())

# # Load face detector
# print("loading face detector")
# protoPath = os.path.sep.join([args["detector"], "deploy.prototxt"])
# modelPath = os.path.sep.join([args["detector"], "res10_300x300_ssd_iter_140000.caffemodel"])
# net = cv2.dnn.readNetFromCaffe(protoPath, modelPath)

# # Load the liveness detection model
# # print("loading the liveness detector")
# # model = tf.saved_model.load(args["model"])
# # model = tf.saved_model.load(args["liveness1"])

# print("loading the liveness detector")
# model = load_model(args["model"])  # Use load_model for .keras or .h5 formats

# # Load label encoder
# le = pickle.loads(open(args["le"], "rb").read())

# # Define function to preprocess image for prediction
# def preprocess_image(face):
#     face = cv2.resize(face, (32, 32))
#     face = face.astype("float32") / 255.0
#     face = img_to_array(face)
#     face = np.expand_dims(face, axis=0)
#     return face

# # Start the video stream
# video_capture = cv2.VideoCapture(0)

# while True:
#     # Read a frame from the video stream
#     ret, frame = video_capture.read()
#     if not ret:
#         break

#     gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
#     (h, w) = frame.shape[:2]
#     blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
#     net.setInput(blob)
#     detections = net.forward()

#     for i in range(0, detections.shape[2]):
#         confidence = detections[0, 0, i, 2]
#         if confidence > args["confidence"]:
#             box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
#             (startX, startY, endX, endY) = box.astype("int")
#             face = frame[startY:endY, startX:endX]

#             # Preprocess face image for liveness detection
#             face = preprocess_image(face)
#             preds = model(face)  # Get predictions from the model
#             preds = preds.numpy()  # Convert TensorFlow tensor to numpy array
#             label_index = np.argmax(preds, axis=-1)[0]  # Get the index of the highest probability
#             confidence = preds[0][label_index]  # Get the confidence for the predicted label

#             # Calculate adjusted confidence
#             adjusted_confidence = confidence * 1.512

#             # Display "Real" or "Fake" based on the confidence threshold
#             label_text = "Real" if confidence < 0.5 else "Fake"
#             label_text = f"{label_text}: {adjusted_confidence:.4f}"
#             # cv2.putText(frame, label_text, (startX, startY - 10), cv2.FONT_HERSHEY_SIMPLEX, 0.5, (0, 0, 255), 2)
#             cv2.rectangle(frame, (startX, startY), (endX, endY), (0, 0, 255), 2)

#     # Show the frame
#     cv2.imshow("Frame", frame)

#     # Check for the 'q' key to exit the loop
#     key = cv2.waitKey(1) & 0xFF
#     if key == ord("q"):
#         break

# # Clean up
# video_capture.release()
# cv2.destroyAllWindows()


import tensorflow as tf
import argparse
import cv2
import numpy as np
import os
import pickle
from tensorflow.keras.preprocessing.image import img_to_array

# Correct method to load a .keras or .h5 file
from tensorflow.keras.models import load_model




# Construct argument parse and parse the arguments
ap = argparse.ArgumentParser()
ap.add_argument("-m", "--model", type=str, required=True, help="path to trained model")
ap.add_argument("-l", "--le", type=str, required=True, help="path to label encoder")
ap.add_argument("-d", "--detector", type=str, required=True, help="path to OpenCV's deep learning face detector")
ap.add_argument("-c", "--confidence", type=float, default=0.5, help="minimum probability to filter weak detections")
ap.add_argument("-p", "--shape-predictor", required=True, help="path to facial landmark predictor")
ap.add_argument("-o", "--output", type=str, required=True, help="path to output text file")
args = vars(ap.parse_args())

# Load face detector
print("loading face detector")
protoPath = os.path.sep.join([args["detector"], "deploy.prototxt"])
modelPath = os.path.sep.join([args["detector"], "res10_300x300_ssd_iter_140000.caffemodel"])
net = cv2.dnn.readNetFromCaffe(protoPath, modelPath)

# # Load the liveness detection model
# print("loading the liveness detector")
# model = tf.saved_model.load(args["model"])

# Load the liveness detection model
print("loading the liveness detector")
model = load_model(args["model"])  # Use the correct function for loading .keras files

# Load label encoder
le = pickle.loads(open(args["le"], "rb").read())

# Define function to preprocess image for prediction
def preprocess_image(face):
    face = cv2.resize(face, (32, 32))
    face = face.astype("float32") / 255.0
    face = img_to_array(face)
    face = np.expand_dims(face, axis=0)
    return face

# Start the video stream
video_capture = cv2.VideoCapture(0)

# Open the text file for writing results
with open(args["output"], "w") as file:
    while True:
        # Read a frame from the video stream
        ret, frame = video_capture.read()
        if not ret:
            break

        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
        (h, w) = frame.shape[:2]
        blob = cv2.dnn.blobFromImage(cv2.resize(frame, (300, 300)), 1.0, (300, 300), (104.0, 177.0, 123.0))
        net.setInput(blob)
        detections = net.forward()
        
        for i in range(0, detections.shape[2]):
            confidence = detections[0, 0, i, 2]
            if confidence > args["confidence"]:
                box = detections[0, 0, i, 3:7] * np.array([w, h, w, h])
                (startX, startY, endX, endY) = box.astype("int")
                face = frame[startY:endY, startX:endX]
                
                # Preprocess face image for liveness detection
                face = preprocess_image(face)
                preds = model(face)  # Get predictions from the model
                preds = preds.numpy()  # Convert TensorFlow tensor to numpy array
                label_index = np.argmax(preds, axis=-1)[0]  # Get the index of the highest probability
                confidence = preds[0][label_index]  # Get the confidence for the predicted label

                # Calculate adjusted confidence
                adjusted_confidence = confidence * 1.512

                # Determine label and format the result
                label_text = "Real" if confidence < 0.5 else "Fake"
                result = f"{label_text} ({adjusted_confidence:.4f}) - Box: ({startX}, {startY}, {endX}, {endY})\n"
                file.write(result)
        
        # Show the frame
        cv2.imshow("Frame", frame)

        # Check for the 'q' key to exit the loop
        key = cv2.waitKey(1) & 0xFF
        if key == ord("q"):
            break

# Clean up
video_capture.release()
cv2.destroyAllWindows()