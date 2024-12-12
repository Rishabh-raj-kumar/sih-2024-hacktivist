from datetime import datetime
from database import db

class PotentialMatch(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    report_id = db.Column(db.Integer, db.ForeignKey('person.id'), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    location = db.Column(db.String(200), nullable=False)
    camera_id = db.Column(db.String(50), nullable=False)
    source_face = db.Column(db.Text)  # Base64 encoded extracted face
    target_face = db.Column(db.Text)  # Base64 encoded matched face
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    status = db.Column(db.String(20), default='pending')  # pending, confirmed, rejected

    def to_dict(self):
        return {
            'id': self.id,
            'report_id': self.report_id,
            'confidence': self.confidence,
            'location': self.location,
            'camera_id': self.camera_id,
            'source_face': self.source_face,
            'target_face': self.target_face,
            'timestamp': self.timestamp.isoformat(),
            'status': self.status
        }