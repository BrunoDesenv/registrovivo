# MongoDB Atlas Integration Setup Guide

This guide will help you set up and run RegistroVivo with MongoDB Atlas database integration.

## 🎉 What's New

Your application now uses **MongoDB Atlas** (cloud database) instead of localStorage! This means:
- ✅ Data persists across devices
- ✅ Users are stored securely in the database
- ✅ Passwords are hashed with bcrypt
- ✅ Diary entries are stored in MongoDB
- ✅ RESTful API backend with Express.js

## 🔧 Project Structure

```
registrovivo/
├── src/                    # Angular frontend
│   ├── app/
│   │   ├── service/
│   │   │   ├── auth.service.ts      # Now uses HTTP calls
│   │   │   └── diary.service.ts     # Now uses HTTP calls
│   │   └── environments/
│   │       ├── environment.ts       # API URL configuration
│   │       └── environment.prod.ts
│   └── ...
├── backend/                # Express.js backend (NEW!)
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js          # MongoDB connection
│   │   ├── controllers/
│   │   │   ├── authController.js    # Auth logic
│   │   │   └── diaryController.js   # Diary CRUD
│   │   ├── models/
│   │   │   ├── User.js              # User schema
│   │   │   └── DiaryEntry.js        # Diary entry schema
│   │   ├── routes/
│   │   │   ├── auth.js              # Auth routes
│   │   │   └── diary.js             # Diary routes
│   │   └── server.js                # Main server
│   ├── .env                         # Your credentials (NOT in git)
│   ├── .env.example                 # Template
│   └── package.json
└── README.md
```

## 🚀 Setup Instructions

### Step 1: Secure Your Database

⚠️ **CRITICAL SECURITY STEP**

Since you shared your MongoDB credentials, you need to rotate your password:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Navigate to **Database Access** in the left sidebar
3. Find your user `brunojsantos91_db_user`
4. Click **Edit** → **Edit Password**
5. Generate a new password
6. Copy the new password
7. Update `/backend/.env` file with the new password:

```env
MONGODB_URI=mongodb+srv://brunojsantos91_db_user:YOUR_NEW_PASSWORD@cluster.srshetk.mongodb.net/registrovivo?appName=Cluster
```

### Step 2: Start the Backend Server

```bash
cd backend
npm start
```

You should see:
```
🚀 RegistroVivo API Server running on port 3000
📍 Environment: development
🌐 Frontend URL: http://localhost:4200

📚 Available endpoints:
   POST   /api/auth/register
   POST   /api/auth/login
   GET    /api/auth/user
   GET    /api/diary
   GET    /api/diary/:id
   POST   /api/diary
   DELETE /api/diary/:id
   GET    /api/health
```

### Step 3: Start the Angular Frontend

Open a **new terminal** (keep the backend running):

```bash
npm start
```

This will start the Angular dev server on `http://localhost:4200`

### Step 4: Test the Integration

1. Open your browser to `http://localhost:4200`
2. Register a new user (this will be saved to MongoDB!)
3. Login with your new credentials
4. Create a diary entry
5. Refresh the page - your entries should persist!

## 🧪 Testing the API

You can test the backend API independently using curl:

### Health Check
```bash
curl http://localhost:3000/api/health
```

### Register a User
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123","email":"test@example.com"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"test123"}'
```

### Get Diary Entries
```bash
curl "http://localhost:3000/api/diary?username=testuser"
```

### Create Diary Entry
```bash
curl -X POST http://localhost:3000/api/diary \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","title":"My First Entry","content":"This is my first diary entry!"}'
```

## 📊 MongoDB Atlas Dashboard

To view your data in MongoDB Atlas:

1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Click **Browse Collections**
3. Select your database: `registrovivo`
4. You'll see two collections:
   - `users` - All registered users (passwords are hashed!)
   - `diaryentries` - All diary entries

## 🔒 Security Features

✅ **Passwords are hashed** using bcrypt (never stored in plain text)
✅ **Environment variables** keep credentials secure
✅ **.gitignore** prevents committing sensitive data
✅ **CORS protection** only allows requests from your frontend
✅ **Input validation** on all endpoints

## ⚙️ Configuration

### Backend (.env)
```env
MONGODB_URI=mongodb+srv://...
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
```

### Frontend (src/environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🐛 Troubleshooting

### Backend won't start
- Check if MongoDB URI is correct in `.env`
- Ensure port 3000 is not in use: `lsof -i :3000`
- Check MongoDB Atlas network access (should allow your IP)

### Frontend can't connect to backend
- Verify backend is running on port 3000
- Check browser console for CORS errors
- Ensure `FRONTEND_URL` in backend `.env` matches your Angular URL

### Data not persisting
- Check MongoDB Atlas connection in backend logs
- Verify you're logged in (check localStorage for 'currentUser')
- Check browser network tab for failed API calls

### "MongooseError: Operation buffering timed out"
- Check your internet connection
- Verify MongoDB Atlas network access settings
- Confirm your IP is whitelisted in MongoDB Atlas

## 🚀 Production Deployment

When deploying to production:

1. Update `src/environments/environment.prod.ts` with your production API URL
2. Set `NODE_ENV=production` in your backend environment
3. Use a proper secret management service (AWS Secrets Manager, etc.)
4. Enable MongoDB Atlas IP whitelist for your production server
5. Use HTTPS for all communications

## 📝 API Documentation

Full API documentation is available in `/backend/README.md`

## 🎯 Next Steps

- [ ] Add JWT authentication for better security
- [ ] Implement session management
- [ ] Add user profile management
- [ ] Enable diary entry editing
- [ ] Add pagination for large diary entry lists
- [ ] Implement search functionality
- [ ] Add export diary to PDF feature

## ❓ Need Help?

If you encounter issues:
1. Check the browser console (F12)
2. Check backend terminal for errors
3. Verify MongoDB Atlas dashboard shows your data
4. Review this guide's troubleshooting section

Happy journaling! 📖✨
