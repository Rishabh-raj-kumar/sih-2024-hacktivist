import cv2
import numpy as np
import socket
import struct
import pickle
import zlib
import argparse
import psutil
import threading
from obj_det import ComprehensiveDetector

class VideoStreamServer:
    def __init__(self, port=65432):
        self.port = port
        self.server_socket = None
        self.client_sockets = []
        self.is_streaming = False
        self.camera = None
        self.detector = ComprehensiveDetector()

    def get_local_ip(self):
        """
        Get the local IP address of the machine on the WiFi network
        """
        try:
            # Iterate through network interfaces
            for interface in psutil.net_if_addrs():
                # Skip loopback interface
                if interface == 'lo':
                    continue
                
                # Get interface addresses
                for addr in psutil.net_if_addrs()[interface]:
                    if addr.family == socket.AF_INET:
                        ip = addr.address
                        # Exclude localhost and link-local addresses
                        if not ip.startswith('127.') and not ip.startswith('169.254.'):
                            return ip
        except Exception as e:
            print(f"Error finding local IP: {e}")
        
        return '0.0.0.0'

    def start_server(self):
        """
        Start the video streaming server
        """
        # Create server socket
        self.server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        # Bind to local IP
        local_ip = self.get_local_ip()
        self.server_socket.bind((local_ip, self.port))
        self.server_socket.listen(5)
        
        print(f"Video streaming server started:")
        print(f"IP: {local_ip}")
        print(f"Port: {self.port}")
        
        # Start accepting connections
        self.accept_connections()

    def accept_connections(self):
        """
        Accept incoming client connections
        """
        while True:
            try:
                client_socket, address = self.server_socket.accept()
                print(f"Connection from: {address}")
                self.client_sockets.append(client_socket)
                
                # Start streaming thread for this client
                threading.Thread(target=self.stream_video, args=(client_socket,), daemon=True).start()
            except Exception as e:
                print(f"Error accepting connection: {e}")
                break

    def stream_video(self, client_socket):
        """
        Stream video to a specific client
        """
        # Open camera if not already open
        if not self.camera:
            self.camera = cv2.VideoCapture(0)
        
        # Compression parameters
        encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), 85]
        
        try:
            while True:
                # Capture frame
                ret, frame = self.camera.read()
                if not ret:
                    break
                
                # Process frame with object and emotion detection
                frame = self.detector.process_frame(frame)
                
                # Resize frame
                frame = cv2.resize(frame, (640, 480))
                
                # Encode frame
                result, encoded_frame = cv2.imencode('.jpg', frame, encode_param)
                
                # Serialize and compress
                data = pickle.dumps(encoded_frame, 0)
                zdata = zlib.compress(data, zlib.Z_BEST_COMPRESSION)
                
                # Send frame size
                try:
                    message_size = struct.pack("L", len(zdata))
                    client_socket.sendall(message_size + zdata)
                except (BrokenPipeError, ConnectionResetError):
                    print("Client disconnected")
                    break
        
        except Exception as e:
            print(f"Streaming error: {e}")
        
        finally:
            client_socket.close()
            self.client_sockets.remove(client_socket)

    def __del__(self):
        """
        Clean up resources
        """
        if self.camera:
            self.camera.release()
        if self.server_socket:
            self.server_socket.close()

def main():
    parser = argparse.ArgumentParser(description='Video Streaming Server')
    parser.add_argument('--port', type=int, default=65432, 
                        help='Port to use for streaming (default: 65432)')
    
    args = parser.parse_args()
    
    # Create and start server
    server = VideoStreamServer(args.port)
    server.start_server()

if __name__ == "__main__":
    main()