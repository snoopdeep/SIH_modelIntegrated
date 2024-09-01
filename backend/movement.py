# import cv2
# import datetime
# import numpy as np

# color = {"blue": (255, 0, 0), "red": (0, 0, 255), "green": (0, 255, 0), "white": (255, 255, 255)}


# def detect_nose(img, faceCascade):
#     gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     features = faceCascade.detectMultiScale(gray_img, 1.1, 8)
#     nose_cords = []
#     for (x, y, w, h) in features:
#         cv2.circle(img, ((2 * x + w) // 2, (2 * y + h) // 2), 10, color['green'], 2)
#         nose_cords = ((2 * x + w) // 2, (2 * y + h) // 2)
#     return img, nose_cords

# def draw_controller(img, cords):
#     size = 20
#     x1 = cords[0] - size
#     y1 = cords[1] - size
#     x2 = cords[0] + size
#     y2 = cords[1] + size
#     cv2.circle(img, cords, size, color['blue'], 2)
#     return [(x1, y1), (x2, y2)]

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
#             file.write(f"{datetime.datetime.now()}: {cmd}\n")
    
#     return cmd

# def reset_press_flag(nose_cords, cords, cmd):
#     try:
#         [(x1, y1), (x2, y2)] = cords
#         xc, yc = nose_cords
#     except:
#         return True, cmd

#     if x1 < xc < x2 and y1 < yc < y2:
#         return True, None
#     return False, cmd


# faceCascade = cv2.CascadeClassifier('haarcascade_frontalface_default.xml')


# video_capture = cv2.VideoCapture(0) 

# if not video_capture.isOpened():
#     print("Error: Could not open video stream.")
#     exit()

# width = video_capture.get(3)  
# height = video_capture.get(4) 
# press_flag = False
# cmd = ""
# movement_count = 0
# prev_nose_cords = None

# while True:

#     ret, img = video_capture.read()
#     if not ret or img is None:
#         print("Failed to grab frame")
#         break

#     img = cv2.flip(img, 1)

   
#     img, nose_cords = detect_nose(img, faceCascade)
#     cv2.putText(img, cmd, (10, 50), cv2.FONT_HERSHEY_SIMPLEX, 1, color['red'], 1, cv2.LINE_AA)


#     cords = draw_controller(img, (int(width / 2), int(height / 2)))

#     if press_flag and len(nose_cords):
#         cmd = log_movement(nose_cords, cords, cmd, prev_nose_cords)
#         prev_nose_cords = nose_cords

#     press_flag, cmd = reset_press_flag(nose_cords, cords, cmd)

    
#     '''if cmd and cmd != "None":
#         movement_count += 1
#         if movement_count >= 2:
#             print("Two movements detected. Exiting...")
#             break'''
#     cv2.imshow("face detection", img)
#     if cv2.waitKey(1) & 0xFF == ord('q'):
#         break


# video_capture.release()

# cv2.destroyAllWindows()


## SINGLE FRAME 


# import cv2
# import numpy as np
# import datetime

# color = {"blue": (255, 0, 0), "red": (0, 0, 255), "green": (0, 255, 0), "white": (255, 255, 255)}

# def detect_nose(img, faceCascade):
#     gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
#     features = faceCascade.detectMultiScale(gray_img, 1.1, 8)
#     nose_cords = []
#     for (x, y, w, h) in features:
#         cv2.circle(img, ((2 * x + w) // 2, (2 * y + h) // 2), 10, color['green'], 2)
#         nose_cords = ((2 * x + w) // 2, (2 * y + h) // 2)
#     return img, nose_cords

# def draw_controller(img, cords):
#     size = 20
#     x1 = cords[0] - size
#     y1 = cords[1] - size
#     x2 = cords[0] + size
#     y2 = cords[1] + size
#     cv2.circle(img, cords, size, color['blue'], 2)
#     return [(x1, y1), (x2, y2)]

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
#             file.write(f"{datetime.datetime.now()}: {cmd}\n")
    
#     return cmd

# def reset_press_flag(nose_cords, cords, cmd):
#     try:
#         [(x1, y1), (x2, y2)] = cords
#         xc, yc = nose_cords
#     except:
#         return True, cmd

#     if x1 < xc < x2 and y1 < yc < y2:
#         return True, None
#     return False, cmd


import cv2
import datetime
import numpy as np

color = {"blue": (255, 0, 0), "red": (0, 0, 255), "green": (0, 255, 0), "white": (255, 255, 255)}

def detect_nose(img, faceCascade):
    """
    Detects the nose in an image using a Haar Cascade classifier.
    
    Args:
    - img: The input image in which to detect the nose.
    - faceCascade: The Haar Cascade classifier for face detection.
    
    Returns:
    - img: The image with a circle drawn around the detected nose.
    - nose_cords: Coordinates of the detected nose.
    """
    gray_img = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    features = faceCascade.detectMultiScale(gray_img, 1.1, 8)
    nose_cords = []
    for (x, y, w, h) in features:
        cv2.circle(img, ((2 * x + w) // 2, (2 * y + h) // 2), 10, color['green'], 2)
        nose_cords = ((2 * x + w) // 2, (2 * y + h) // 2)
    return img, nose_cords

def draw_controller(img, cords):
    """
    Draws a controller circle in the center of the image.
    
    Args:
    - img: The input image on which to draw.
    - cords: Coordinates for the center of the controller.
    
    Returns:
    - List of the bounding box coordinates of the controller.
    """
    size = 20
    x1 = cords[0] - size
    y1 = cords[1] - size
    x2 = cords[0] + size
    y2 = cords[1] + size
    cv2.circle(img, cords, size, color['blue'], 2)
    return [(x1, y1), (x2, y2)]

def log_movement(nose_cords, cords, cmd, prev_nose_cords):
    """
    Logs and detects movement direction based on nose coordinates and the previous frame.
    
    Args:
    - nose_cords: Coordinates of the detected nose.
    - cords: The bounding box of the controller.
    - cmd: The current command detected.
    - prev_nose_cords: Coordinates of the nose from the previous frame.
    
    Returns:
    - The detected command.
    """
    try:
        [(x1, y1), (x2, y2)] = cords
        xc, yc = nose_cords
    except Exception as e:
        print(e)
        return cmd

    if xc < x1:
        cmd = "left"
    elif xc > x2:
        cmd = "right"
    elif yc < y1:
        cmd = "up"
    elif yc > y2:
        cmd = "down"

    if prev_nose_cords:
        px, py = prev_nose_cords
        angle = np.arctan2(yc - py, xc - px) * 180 / np.pi
        if angle > 10:
            cmd = "clockwise"
        elif angle < -10:
            cmd = "anticlockwise"

    if cmd:
        print("Detected movement: ", cmd, "\n")
        with open("head_movements.txt", "a") as file:
            file.write(f"{datetime.datetime.now()}: {cmd}\n")
    
    return cmd

def reset_press_flag(nose_cords, cords, cmd):
    """
    Resets the press flag for detecting continuous movement.
    
    Args:
    - nose_cords: Coordinates of the detected nose.
    - cords: The bounding box of the controller.
    - cmd: The current command detected.
    
    Returns:
    - A tuple containing a boolean flag and the current command.
    """
    try:
        [(x1, y1), (x2, y2)] = cords
        xc, yc = nose_cords
    except:
        return True, cmd

    if x1 < xc < x2 and y1 < yc < y2:
        return True, None
    return False, cmd
