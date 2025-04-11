# Comprehensive Object and Emotion Detection
import cv2
import numpy as np
from ultralytics import YOLO
from deepface import DeepFace
import requests

class ComprehensiveDetector:
    def __init__(self, yolo_model='yolov8s.pt'):
        # Load YOLO model
        self.yolo = YOLO(yolo_model)
        
        # Emotion color mapping
        self.emotion_colors = {
            'angry': (0, 0, 255),     # Red
            'disgust': (0, 255, 0),    # Green
            'fear': (128, 0, 128),     # Purple
            'happy': (255, 255, 0),    # Cyan
            'sad': (0, 0, 128),        # Dark Red
            'surprise': (255, 165, 0), # Orange
            'neutral': (255, 255, 255), # White
            'crying': (0, 0, 255)      # Red (same as angry for simplicity)
        }
        
        # Predefined color palette for object detection
        self.base_colors = [
            (255, 0, 0), (0, 255, 0), (0, 0, 255), 
            (255, 255, 0), (255, 0, 255), (0, 255, 255)
        ]

    def _get_color(self, cls_num):
        """Generate dynamic colors for object detection."""
        color_index = cls_num % len(self.base_colors)
        return self.base_colors[color_index]

    def process_frame(self, frame):
        """
        Process frame with both object detection and emotion detection
        """
        # Perform object detection
        results = self.yolo.track(frame, stream=True)
        
        for result in results:
            classes_names = result.names
            
            for box in result.boxes:
                # Get box coordinates
                [x1, y1, x2, y2] = box.xyxy[0]
                x1, y1, x2, y2 = map(int, [x1, y1, x2, y2])
                
                cls = int(box.cls[0])
                class_name = classes_names[cls]
                confidence = box.conf[0]
                
                # Object detection for person
                if class_name == 'person':
                    try:
                        # Crop person region
                        person_region = frame[y1:y2, x1:x2]
                        
                        # Attempt emotion detection
                        try:
                            emotion_analysis = DeepFace.analyze(
                                person_region, 
                                actions=['emotion'],
                                enforce_detection=False
                            )
                            
                            # Get dominant emotion
                            dominant_emotion = emotion_analysis[0]['dominant_emotion']
                            
                            # Check if the detected emotion is crying
                            if dominant_emotion == 'crying':
                                # Data to write to Firebase
                                data = {
                                    'emotion': 'crying',
                                    'message': 'found crying'
                                }
                                firebase_url = "https://your-database-name.firebaseio.com/"
                                
                                # The reference 'emotions/crying' will store the data at that location in the database
                                url = f"{firebase_url}emotions/crying.json"
                                response = requests.put(url, json=data)
                                if response.status_code == 200:
                                    print("Data written successfully!")
                                else:
                                    print("Failed to write data:", response.status_code)
                            
                            # Choose color based on emotion
                            color = self.emotion_colors.get(dominant_emotion, (255, 255, 255))
                            
                            # Draw rectangle and emotion
                            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                            cv2.putText(frame, 
                                        f'{class_name}: {dominant_emotion}', 
                                        (x1, y1-10), 
                                        cv2.FONT_HERSHEY_SIMPLEX, 
                                        0.6, color, 2)
                        
                        except Exception as emotion_err:
                            # If emotion detection fails, use default object detection
                            color = self._get_color(cls)
                            cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                            cv2.putText(frame, 
                                        f'{class_name} {confidence:.2f}', 
                                        (x1, y1-10), 
                                        cv2.FONT_HERSHEY_SIMPLEX, 
                                        0.6, color, 2)
                    
                    except Exception as e:
                        print(f"Error processing person: {e}")
                
                # Object detection for other classes
                else:
                    color = self._get_color(cls)
                    cv2.rectangle(frame, (x1, y1), (x2, y2), color, 2)
                    cv2.putText(frame, 
                                f'{class_name} {confidence:.2f}', 
                                (x1, y1-10), 
                                cv2.FONT_HERSHEY_SIMPLEX, 
                                0.6, color, 2)
        
        return frame

    def detect_stream(self):
        """Generator for video stream processing"""
        videoCap = cv2.VideoCapture(0)
        
        # Set lower resolution for better performance
        videoCap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
        videoCap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)
        
        try:
            while True:
                ret, frame = videoCap.read()
                if not ret:
                    break
                
                # Process frame
                processed_frame = self.process_frame(frame)
                
                # Encode frame for streaming
                ret, buffer = cv2.imencode('.jpg', processed_frame)
                frame_bytes = buffer.tobytes()
                
                yield (b'--frame\r\n'
                       b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        
        finally:
            videoCap.release()