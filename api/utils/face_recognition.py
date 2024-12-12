import os
import base64
from io import BytesIO
from PIL import Image
from deepface import DeepFace
import numpy as np
from typing import Dict, List, Optional

class FaceRecognitionService:
    def __init__(self, db_path: str = "face_db"):
        self.db_path = db_path
        os.makedirs(db_path, exist_ok=True)

    def base64_to_image(self, base64_str: str) -> Image.Image:
        """Convert base64 string to PIL Image"""
        # Remove data URL prefix if present
        if ',' in base64_str:
            base64_str = base64_str.split(',')[1]
        
        image_data = base64.b64decode(base64_str)
        return Image.open(BytesIO(image_data))

    def save_temp_image(self, image: Image.Image, filename: str) -> str:
        """Save an image temporarily for DeepFace processing."""
        # Convert RGBA to RGB if necessary
        if image.mode == "RGBA":
            image = image.convert("RGB")
        filepath = os.path.join(self.db_path, filename)
        image.save(filepath)
        return filepath

    def find_matches(self, target_image: str, threshold: float = 0.6) -> List[Dict]:
        """
        Find matching faces in the database
        Args:
            target_image: Base64 encoded image string
            threshold: Similarity threshold (0-1)
        Returns:
            List of matching results with confidence scores
        """
        try:
            # Convert base64 to image and save temporarily
            img = self.base64_to_image(target_image)
            target_path = self.save_temp_image(img, "target_temp.jpg")

            # Find matches using DeepFace
            results = DeepFace.find(
                img_path=target_path,
                db_path=self.db_path,
                enforce_detection=True,
                model_name="VGG-Face",
                distance_metric="cosine"
            )

            # Clean up temporary file
            os.remove(target_path)

            if not isinstance(results, list) or len(results) == 0:
                return []

            # Process and filter results
            matches = []
            for result in results[0].itertuples():
                confidence = 1 - float(result.VGG-Face_cosine)
                if confidence >= threshold:
                    matches.append({
                        'image_path': result.identity,
                        'confidence': round(confidence * 100, 2),
                        'distance': float(result.VGG-Face_cosine)
                    })

            return sorted(matches, key=lambda x: x['confidence'], reverse=True)

        except Exception as e:
            raise Exception(f"Face recognition error: {str(e)}")

    def verify_face(self, img1_base64: str, img2_base64: str) -> Dict:
        """
        Verify if two face images match
        Args:
            img1_base64: stream image in base64
            img2_base64: target image in base64
        Returns:
            Verification result with confidence score
        """
        try:
            # Convert and save both images temporarily
            img1 = self.base64_to_image(img1_base64)
            img2 = self.base64_to_image(img2_base64)
            
            img1_path = self.save_temp_image(img1, "verify_1_temp.jpg")
            img2_path = self.save_temp_image(img2, "verify_2_temp.jpg")

            print("img1 path : ",img1_path)
            print("img2 path : ",img2_path)

            # Verify faces
            result = DeepFace.verify(
                img1_path=img1_path,
                img2_path=img2_path,
                model_name="VGG-Face",
                distance_metric="cosine",
                enforce_detection=True
            )

            # Clean up temporary files
            os.remove(img1_path)
            os.remove(img2_path)

            return {
                'verified': result['verified'],
                'confidence': round((1 - result['distance']) * 100, 2),
                'distance': result['distance']
            }

        except Exception as e:
            raise Exception(f"Face verification error: {str(e)}")