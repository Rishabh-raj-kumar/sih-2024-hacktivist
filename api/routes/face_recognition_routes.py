from flask import Blueprint, request, jsonify
from utils.face_recognition import FaceRecognitionService
import base64

face_bp = Blueprint('face', __name__)
face_service = FaceRecognitionService()

@face_bp.route('/verify', methods=['POST'])
def verify_faces():
    """Verify if two faces match"""
    try:
        data = request.get_json()
        if not data or 'image1' not in data or 'image2' not in data:
            return jsonify({'error': 'Both images are required'}), 400

        result = face_service.verify_face(data['image1'], data['image2'])
        return jsonify({
            'message': 'Face verification completed',
            'data': result
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@face_bp.route('/stream/check', methods=['POST'])
def check_stream():
    """Check stream image against target image"""
    try:
        data = request.get_json()
        if not data or 'stream_image' not in data or 'target_image' not in data:
            return jsonify({'error': 'Both stream and target images are required'}), 400
        result = face_service.verify_face(
            data['stream_image'],
            data['target_image']
        )

        return jsonify({
            'message': 'Stream check completed',
            'data': result
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@face_bp.route('/find', methods=['POST'])
def find_faces():
    """Find matching faces in the database"""
    try:
        data = request.get_json()
        if not data or 'image' not in data:
            return jsonify({'error': 'Image is required'}), 400

        threshold = float(data.get('threshold', 0.6))
        matches = face_service.find_matches(data['image'], threshold)

        return jsonify({
            'message': 'Face search completed',
            'data': matches
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500