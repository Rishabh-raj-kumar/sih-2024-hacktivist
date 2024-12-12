import base64
import re

def is_valid_base64_image(base64_string):
    """
    Validate if the string is a valid base64 encoded image
    """
    try:
        # Check if the string starts with data:image
        if not re.match(r'^data:image/.+;base64,', base64_string):
            return False
        
        # Remove the data:image prefix
        base64_data = base64_string.split(',')[1]
        
        # Try to decode the base64 string
        base64.b64decode(base64_data)
        return True
    except Exception:
        return False

def compress_base64_image(base64_string, max_size_kb=500):
    """
    Compress base64 image if it exceeds max_size_kb
    Note: This is a placeholder for actual image compression logic
    """
    # TODO: Implement image compression logic
    return base64_string