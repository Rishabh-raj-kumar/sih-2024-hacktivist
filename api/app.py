from flask import Flask
from flask_cors import CORS
from config import Config
from database import db
from routes.person_routes import person_bp
from routes.face_recognition_routes import face_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    
    # Initialize extensions
    CORS(app)
    db.init_app(app)
    
    # Register blueprints
    app.register_blueprint(person_bp, url_prefix='/api/persons')
    app.register_blueprint(face_bp, url_prefix='/api/face')
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    app.run(port=5000)