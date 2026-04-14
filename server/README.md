# FlavorVerse Backend Server

A Node.js Express API for the FlavorVerse recipe sharing platform.

## 🚀 Quick Start

### 1. Install Dependencies
```bash
cd server
npm install
```

### 2. Setup MongoDB

You have two options:

#### Option A: MongoDB Atlas (Recommended - No Installation Required)
1. Follow the guide in `MONGODB_SETUP.md`
2. Update `.env` with your Atlas connection string

#### Option B: Local MongoDB
1. Install MongoDB locally (see `MONGODB_SETUP.md`)
2. Start MongoDB service
3. Use default connection string in `.env`

### 3. Check MongoDB Connection
```bash
npm run check-db
```

This will verify if MongoDB is accessible before starting the server.

### 4. Start the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

## 📡 API Endpoints

Once the server is running, you can access:

- **Base API**: http://localhost:5000/api
- **Health Check**: http://localhost:5000/api/health
- **Auth**: http://localhost:5000/api/auth
- **Recipes**: http://localhost:5000/api/recipes
- **Users**: http://localhost:5000/api/users
- **Comments**: http://localhost:5000/api/recipes/:recipeId/comments

## 🔧 Environment Variables

Create a `.env` file in the server directory:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/flavorverse
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
```

For MongoDB Atlas:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/flavorverse?retryWrites=true&w=majority
```

## 🛠️ Available Scripts

- `npm start` - Start the server in production mode
- `npm run dev` - Start the server in development mode with auto-reload
- `npm run check-db` - Test MongoDB connection

## 📁 Project Structure

```
server/
├── config/
│   └── db.js              # MongoDB connection configuration
├── controllers/
│   ├── authController.js  # Authentication logic
│   ├── recipeController.js
│   ├── userController.js
│   └── commentController.js
├── middleware/
│   ├── auth.js            # JWT authentication middleware
│   ├── errorHandler.js    # Global error handler
│   └── upload.js          # File upload middleware
├── models/
│   ├── User.js            # User schema
│   ├── Recipe.js          # Recipe schema
│   └── Comment.js         # Comment schema
├── routes/
│   ├── authRoutes.js
│   ├── recipeRoutes.js
│   ├── userRoutes.js
│   └── commentRoutes.js
├── uploads/               # Uploaded images
├── .env                   # Environment variables
├── server.js              # Main application file
├── check-mongodb.js       # MongoDB connection checker
├── MONGODB_SETUP.md       # Detailed MongoDB setup guide
└── package.json
```

## 🔒 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-Origin Resource Sharing enabled
- **JWT**: JSON Web Token authentication
- **bcryptjs**: Password hashing

## 🐛 Troubleshooting

### MongoDB Connection Issues

If you see: `MongoDB Connection Error: connect ECONNREFUSED 127.0.0.1:27017`

**Solutions:**
1. Run `npm run check-db` to diagnose the issue
2. Make sure MongoDB is running locally
3. Or switch to MongoDB Atlas (see `MONGODB_SETUP.md`)

### Server Won't Start

1. Check if port 5000 is already in use
2. Verify all environment variables are set in `.env`
3. Make sure all dependencies are installed: `npm install`

### API Returns 404

1. Check if the route exists in the routes folder
2. Verify the route is properly imported in `server.js`
3. Check the HTTP method (GET, POST, PUT, DELETE)

## 📚 API Documentation

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Recipe Endpoints

#### Get All Recipes
```http
GET /api/recipes?page=1&limit=12&sort=newest&category=vegetarian
```

#### Get Single Recipe
```http
GET /api/recipes/:id
```

#### Create Recipe
```http
POST /api/recipes
Authorization: Bearer <token>
Content-Type: multipart/form-data

{
  "title": "Delicious Pasta",
  "description": "A tasty pasta recipe",
  "ingredients": ["pasta", "tomato sauce"],
  "instructions": ["Boil pasta", "Add sauce"],
  "cookTime": 30,
  "servings": 4,
  "category": "lunch",
  "image": <file>
}
```

#### Update Recipe
```http
PUT /api/recipes/:id
Authorization: Bearer <token>
```

#### Delete Recipe
```http
DELETE /api/recipes/:id
Authorization: Bearer <token>
```

#### Like/Unlike Recipe
```http
POST /api/recipes/:id/like
Authorization: Bearer <token>
```

#### Rate Recipe
```http
POST /api/recipes/:id/rate
Authorization: Bearer <token>
Content-Type: application/json

{
  "rating": 5
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/:id
```

#### Update Profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
```

#### Get User's Recipes
```http
GET /api/users/:id/recipes
```

#### Get Favorites
```http
GET /api/users/favorites
Authorization: Bearer <token>
```

#### Add to Favorites
```http
POST /api/users/favorites/:recipeId
Authorization: Bearer <token>
```

### Comment Endpoints

#### Get Comments
```http
GET /api/recipes/:recipeId/comments
```

#### Add Comment
```http
POST /api/recipes/:recipeId/comments
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Great recipe!"
}
```

#### Delete Comment
```http
DELETE /api/comments/:id
Authorization: Bearer <token>
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

ISC

## 💬 Support

For issues and questions:
- Check `MONGODB_SETUP.md` for database setup
- Run `npm run check-db` to diagnose connection issues
- Review the troubleshooting section above
