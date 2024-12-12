# Missing Persons API

This Flask API provides endpoints for managing missing person reports.

## Setup

1. Create a virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Run the application:
```bash
python app.py
```

## API Endpoints

### Report Missing Person
- **POST** `/api/persons/report`
- Body:
```json
{
    "name": "John Doe",
    "age": 25,
    "gender": "male",
    "contact": "1234567890",
    "location": "Ram Ghat",
    "description": "Last seen wearing orange kurta",
    "photo": "base64_encoded_image_string"
}
```

### Get Report by Number
- **GET** `/api/persons/report/<report_number>`

### Get All Reports
- **GET** `/api/persons/reports`
- Query Parameters:
  - status: Filter by status (active/found/closed)

## Database Schema

The SQLite database contains a `person` table with the following columns:
- id (Primary Key)
- report_number (Unique)
- name
- age
- gender
- contact
- location
- description
- photo (Base64 encoded)
- status
- created_at
- updated_at