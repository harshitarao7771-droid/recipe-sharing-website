# MongoDB Setup Guide for FlavorVerse

## Option 1: Local MongoDB Installation

### Windows
1. Download MongoDB Community Server from: https://www.mongodb.com/try/download/community
2. Install MongoDB with default settings
3. Start MongoDB service:
   ```bash
   net start MongoDB
   ```
4. Verify MongoDB is running:
   ```bash
   mongosh
   ```

### macOS
1. Install using Homebrew:
   ```bash
   brew tap mongodb/brew
   brew install mongodb-community
   ```
2. Start MongoDB service:
   ```bash
   brew services start mongodb-community
   ```
3. Verify MongoDB is running:
   ```bash
   mongosh
   ```

### Linux (Ubuntu/Debian)
1. Import MongoDB public GPG key:
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   ```
2. Add MongoDB repository:
   ```bash
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   ```
3. Install MongoDB:
   ```bash
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   ```
4. Start MongoDB service:
   ```bash
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```
5. Verify MongoDB is running:
   ```bash
   mongosh
   ```

## Option 2: MongoDB Atlas (Cloud Database) - RECOMMENDED

### Why MongoDB Atlas?
- ✅ Free tier available (512MB storage)
- ✅ No local installation required
- ✅ Automatic backups
- ✅ Better for production
- ✅ Works from anywhere

### Setup Steps:

1. **Create Account**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Sign up for free

2. **Create Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select a cloud provider and region (closest to you)
   - Click "Create Cluster"

3. **Create Database User**
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Username: `flavorverse_user`
   - Password: Generate a secure password (save it!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Whitelist IP Address**
   - Go to "Network Access" in left sidebar
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP address
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" in left sidebar
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like):
     ```
     mongodb+srv://flavorverse_user:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
     ```

6. **Update .env File**
   - Open `server/.env`
   - Replace `<password>` with your actual password
   - Add database name at the end:
     ```env
     MONGODB_URI=mongodb+srv://flavorverse_user:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/flavorverse?retryWrites=true&w=majority
     ```

7. **Test Connection**
   - Restart your server:
     ```bash
     cd server
     npm run dev
     ```
   - You should see: "✅ MongoDB Connected Successfully!"

## Troubleshooting

### Error: connect ECONNREFUSED 127.0.0.1:27017
- **Cause**: MongoDB is not running locally
- **Solution**: 
  - Start MongoDB service (see commands above)
  - OR switch to MongoDB Atlas

### Error: Authentication failed
- **Cause**: Wrong username/password in connection string
- **Solution**: 
  - Check your MongoDB Atlas credentials
  - Make sure password doesn't contain special characters (or URL encode them)

### Error: IP not whitelisted
- **Cause**: Your IP address is not allowed to connect
- **Solution**: 
  - Go to MongoDB Atlas → Network Access
  - Add your current IP or allow all IPs (0.0.0.0/0)

### Error: Server selection timed out
- **Cause**: Cannot reach MongoDB server
- **Solution**: 
  - Check your internet connection
  - Verify the connection string is correct
  - Make sure cluster is running in MongoDB Atlas

## Verify Connection

After starting your server, check:

1. **Server logs** should show:
   ```
   ✅ MongoDB Connected Successfully!
   📍 Host: cluster0-shard-00-00.xxxxx.mongodb.net
   🗄️  Database: flavorverse
   ```

2. **Health endpoint**: Visit http://localhost:5000/api/health
   - Should show: `"database": "connected"`

## Need Help?

- MongoDB Documentation: https://docs.mongodb.com/
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com/
- MongoDB Community Forums: https://www.mongodb.com/community/forums/
