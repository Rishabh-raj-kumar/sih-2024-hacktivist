def validate_person_data(data):
    """
    Validate person data before saving to database
    """
    errors = []
    
    # Name validation
    if not data.get('name') or len(data['name']) < 2:
        errors.append("Name must be at least 2 characters long")
    
    # Age validation
    try:
        age = int(data.get('age', 0))
        if age < 0 or age > 120:
            errors.append("Age must be between 0 and 120")
    except ValueError:
        errors.append("Age must be a valid number")
    
    # Gender validation
    valid_genders = ['male', 'female', 'other']
    if data.get('gender', '').lower() not in valid_genders:
        errors.append("Gender must be one of: male, female, other")
    
    # Contact validation
    contact = str(data.get('contact', ''))
    if not contact.isdigit() or len(contact) < 10:
        errors.append("Contact must be a valid phone number with at least 10 digits")
    
    # Location validation
    if not data.get('location') or len(data['location']) < 3:
        errors.append("Location must be at least 3 characters long")
    
    return errors