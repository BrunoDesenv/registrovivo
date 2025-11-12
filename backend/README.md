# RegistroVivo Backend API

Backend API for the RegistroVivo diary application built with Express.js and MongoDB Atlas.

## Prerequisites

- Node.js (v14 or higher)
- MongoDB Atlas account
- npm or yarn

## Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Update the `MONGODB_URI` with your MongoDB Atlas connection string
   - ⚠️ **IMPORTANT**: Rotate your database password in MongoDB Atlas for security

4. Start the development server:
```bash
npm run dev
```

Or for production:
```bash
npm start
```

## API Endpoints

### Authentication

#### Register User
```
POST /api/auth/register
Content-Type: application/json

{
  "username": "user123",
  "password": "password123",
  "email": "user@example.com"
}
```

#### Login
```
POST /api/auth/login
Content-Type: application/json

{
  "username": "user123",
  "password": "password123"
}
```

#### Get Current User
```
GET /api/auth/user?username=user123
```

### Diary Entries

#### Get All Entries
```
GET /api/diary?username=user123
```

#### Get Single Entry
```
GET /api/diary/:id?username=user123
```

#### Create Entry
```
POST /api/diary
Content-Type: application/json

{
  "username": "user123",
  "title": "My Day",
  "content": "Today was a great day..."
}
```

#### Delete Entry
```
DELETE /api/diary/:id?username=user123
```

### Health Check
```
GET /api/health
```

## Security Notes

1. **Never commit `.env` file** to version control
2. **Rotate your MongoDB password** immediately after sharing
3. Passwords are hashed using bcrypt before storage
4. CORS is configured for the Angular frontend

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js       # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js # Authentication logic
│   │   └── diaryController.js# Diary CRUD logic
│   ├── models/
│   │   ├── User.js           # User schema
│   │   └── DiaryEntry.js     # Diary entry schema
│   ├── routes/
│   │   ├── auth.js           # Auth routes
│   │   └── diary.js          # Diary routes
│   └── server.js             # Main server file
├── .env                      # Environment variables (not in git)
├── .env.example              # Example env file
├── package.json
└── README.md
```

## Development

The server runs on port 3000 by default. You can change this in the `.env` file.

For development with auto-reload:
```bash
npm run dev
```

## Testing

Test the API using:
- curl
- Postman
- Thunder Client (VS Code extension)
- Your Angular frontend

Example curl command:
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","password":"test123"}'
```
