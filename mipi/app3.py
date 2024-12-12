import cv2
import numpy as np
import socket
import struct
import pickle
import zlib
from flask import Flask, Response

class VideoStreamClient:
    def __init__(self, host, port=65432):
        self.host = host
        self.port = port
        self.client_socket = None
        self.frame = None  # Store the latest frame to be streamed

    def connect_and_stream(self):
        """
        Connect to the video streaming server and receive video frames.
        """
        # Create socket
        self.client_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        
        try:
            # Connect to server
            print(f"Connecting to {self.host}:{self.port}")
            self.client_socket.connect((self.host, self.port))
            print("Connected successfully!")
            
            # Initialize data reception
            data = b""
            payload_size = struct.calcsize("L")
            
            while True:
                # Retrieve message size
                while len(data) < payload_size:
                    packet = self.client_socket.recv(4096)
                    if not packet:
                        print("Connection lost.")
                        return
                    data += packet
                
                # Extract message size
                packed_msg_size = data[:payload_size]
                data = data[payload_size:]
                msg_size = struct.unpack("L", packed_msg_size)[0]
                
                # Retrieve frame data
                while len(data) < msg_size:
                    packet = self.client_socket.recv(4096)
                    if not packet:
                        print("Connection lost.")
                        return
                    data += packet
                
                # Extract and process frame
                frame_data = data[:msg_size]
                data = data[msg_size:]
                
                try:
                    # Decompress and decode frame
                    frame = pickle.loads(zlib.decompress(frame_data))
                    self.frame = cv2.imdecode(frame, cv2.IMREAD_COLOR)  # Store the frame
                    
                except Exception as e:
                    print(f"Frame processing error: {e}")
        
        except Exception as e:
            print(f"Connection error: {e}")
        
        finally:
            # Clean up
            if self.client_socket:
                self.client_socket.close()

    def get_frame(self):
        """
        Get the latest frame.
        """
        if self.frame is not None:
            _, encoded_image = cv2.imencode('.jpg', self.frame)
            return encoded_image.tobytes()
        return None


# Flask application for serving video stream
app = Flask(__name__)
client = None  # Will be initialized later


@app.route('/video_feed')
def video_feed():
    """
    Video streaming route. Returns the video feed as a response.
    """
    def generate_frames():
        while True:
            if client:
                frame = client.get_frame()
                if frame:
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + frame + b'\r\n')
    
    return Response(generate_frames(), content_type='multipart/x-mixed-replace; boundary=frame')


@app.route('/')
def index():
    """
    Homepage with embedded video feed.
    """
    return """
    <!doctype html>
    <html>
        <body>
            <img src="/video_feed" style="max-width: 100%; height: 100%;">
        </body>
    </html>
    """


def main(host, port):
    global client
    # Start the video stream client
    client = VideoStreamClient(host, port)
    
    # Run client in a separate thread
    import threading
    client_thread = threading.Thread(target=client.connect_and_stream, daemon=True)
    client_thread.start()
    
    # Start Flask app
    app.run(host='0.0.0.0', port=5002, threaded=True)


if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser(description='Video Streaming Client with Web Frontend')
    parser.add_argument('--host', type=str, required=True, 
                        help='Server IP address to connect to')
    parser.add_argument('--port', type=int, default=65432, 
                        help='Port to use for streaming (default: 65432)')
    args = parser.parse_args()
    main(args.host, args.port)