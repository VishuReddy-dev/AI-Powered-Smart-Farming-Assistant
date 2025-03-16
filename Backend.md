# Farming Assistant API 🌿

A robust backend service for plant disease detection and treatment recommendations using AI. This project is part of the Google Solution Challenge 2024.

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- Plant.id API key
- Google Gemini API key

### Installation

1. Clone the repository

```bash
git clone [repository-url]
cd solution_challenge
```

2. Install dependencies

```bash
cd backend
npm install
```

3. Create `.env` file in the backend directory

```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
API_KEY=your_plant_id_api_key
GEMINI_API_KEY=your_gemini_api_key
```

4. Start the server

```bash
npm start
```

## 📚 API Documentation

### Authentication Endpoints

#### Register Farmer

```http
POST /api/farmers/register
```

**Request Body:**

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "location": "Sample Location"
}
```

**Response:**

```json
{
  "success": true,
  "farmer": {
    "_id": "farmer_id",
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "1234567890",
    "location": "Sample Location"
  },
  "token": "jwt_token"
}
```

#### Login

```http
POST /api/farmers/login
```

**Request Body:**

```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "success": true,
  "farmer": {
    "_id": "farmer_id",
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "jwt_token"
}
```

#### Get Profile

```http
GET /api/farmers/profile
Authorization: Bearer jwt_token
```

**Response:**

```json
{
    "success": true,
    "farmer": {
        "_id": "farmer_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "1234567890",
        "location": "Sample Location",
        "healthAssessments": [...]
    }
}
```

### Plant Health Assessment Endpoints

#### Submit Plant for Assessment

```http
POST /api/assess-plant
Authorization: Bearer jwt_token
Content-Type: multipart/form-data
```

**Request Body:**

```
image: [plant image file]
farmerId: farmer_id
```

**Response:**

```json
{
    "success": true,
    "data": {
        "assessment": {
            "health_assessment": {
                "diseases": [...],
                "health_level": "..."
            }
        },
        "treatment_plan": {
            "immediate_steps": [...],
            "prevention": [...],
            "organic_solutions": [...],
            "chemical_solutions": [...]
        },
        "assessmentId": "assessment_id"
    }
}
```

#### Get Assessment History

```http
GET /api/assessments/:farmerId
Authorization: Bearer jwt_token
```

**Response:**

```json
{
    "success": true,
    "assessments": [
        {
            "imageUrl": "path_to_image",
            "results": {
                "health_assessment": {...},
                "treatment_plan": {...}
            },
            "createdAt": "timestamp"
        }
    ]
}
```

## 🔒 Authentication

All protected endpoints require a JWT token in the Authorization header:

## 📁 File Upload Guidelines

- Supported image formats: JPG, JPEG, PNG
- Maximum file size: 5MB
- Clear, well-lit images of plant leaves/flowers for best results

## ⚠️ Error Responses

The API returns appropriate HTTP status codes:

- 200: Success
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Server Error

Error response format:

```json
{
  "error": "Error message description"
}
```

## 🛠️ Development

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

For any queries or support, please open an issue in the repository.
