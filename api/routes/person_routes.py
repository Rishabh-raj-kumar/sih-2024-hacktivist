from flask import Blueprint, request, jsonify
from models.person import Person
from database import db
import random
import string
from utils.validators import validate_person_data
from utils.image_utils import is_valid_base64_image, compress_base64_image

person_bp = Blueprint('person', __name__)

def generate_report_number():
    prefix = 'MP'
    random_chars = ''.join(random.choices(string.ascii_uppercase + string.digits, k=8))
    return f"{prefix}{random_chars}"

@person_bp.route('/report', methods=['POST'])
def report_missing_person():
    try:
        data = request.get_json()
        
        # Validate required fields
        validation_errors = validate_person_data(data)
        if validation_errors:
            return jsonify({'error': validation_errors}), 400

        # Validate and process image
        if not is_valid_base64_image(data['photo']):
            return jsonify({'error': 'Invalid image format'}), 400
        
        # Compress image if needed
        compressed_photo = compress_base64_image(data['photo'])

        # Create new person record
        new_person = Person(
            report_number=generate_report_number(),
            name=data['name'],
            age=data['age'],
            gender=data['gender'],
            contact=data['contact'],
            location=data['location'],
            description=data.get('description', ''),
            photo=compressed_photo
        )

        db.session.add(new_person)
        db.session.commit()

        return jsonify({
            'message': 'Missing person report created successfully',
            'report_number': new_person.report_number,
            'data': new_person.to_dict()
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500

@person_bp.route('/report/<report_number>', methods=['GET'])
def get_report(report_number):
    try:
        person = Person.query.filter_by(report_number=report_number).first()
        if not person:
            return jsonify({'error': 'Report not found'}), 404

        return jsonify({
            'message': 'Report found',
            'data': person.to_dict()
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@person_bp.route('/reports', methods=['GET'])
def get_all_reports():
    try:
        status = request.args.get('status', 'active')
        persons = Person.query.filter_by(status=status).all()
        return jsonify({
            'message': 'Reports retrieved successfully',
            'data': [person.to_dict() for person in persons]
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@person_bp.route('/report/<report_number>', methods=['PATCH'])
def update_report_status(report_number):
    try:
        data = request.get_json()
        
        # Validate status
        if not data or 'status' not in data:
            return jsonify({'error': 'Status is required'}), 400
            
        new_status = data['status'].lower()
        valid_statuses = ['active', 'found', 'closed']
        
        if new_status not in valid_statuses:
            return jsonify({'error': f'Status must be one of: {", ".join(valid_statuses)}'}), 400

        # Find and update the report
        person = Person.query.filter_by(report_number=report_number).first()
        if not person:
            return jsonify({'error': 'Report not found'}), 404

        # Update status and timestamp
        person.status = new_status
        db.session.commit()

        return jsonify({
            'message': 'Report status updated successfully',
            'data': person.to_dict()
        }), 200

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500