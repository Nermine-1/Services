# Servicek - Dynamic Service Platform

A dynamic service platform with MongoDB backend and React frontend.

## Features

- **Dynamic Provider Listings**: Fetch providers from MongoDB database
- **Authentication System**: User and provider registration/login
- **Favorites Management**: Save favorite providers
- **Search & Filter**: Search providers by category, name, and location
- **Featured Providers**: Premium providers highlighted
- **Admin Dashboard**: Verify provider accounts
- **Multilingual Support**: French and Arabic

## Technology Stack

### Frontend
- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI components
- React Query for data fetching
- Axios for API calls

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT for authentication
- Bcrypt for password hashing

## Setup Instructions

### 1. Install MongoDB

Make sure you have MongoDB installed and running:
```bash
# Start MongoDB service
mongod
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Build TypeScript
npm run build

# Start the server
npm run dev
```

The backend will run on `http://localhost:5000`

### 3. Frontend Setup

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173`

### 4. Seed Database (Optional)

To populate the database with sample data:
```bash
# Navigate to backend
cd backend

# Run the seeder script
npx ts-node src/seeder.ts
```

## API Endpoints

### Auth Routes
- `POST /api/auth/register` - Register a user
- `POST /api/auth/login` - Login a user
- `POST /api/auth/provider-register` - Register a provider
- `POST /api/auth/provider-login` - Login a provider

### Provider Routes
- `GET /api/providers` - Get all providers (with optional filters)
- `GET /api/providers/featured` - Get featured providers
- `GET /api/providers/:id` - Get provider by ID
- `PUT /api/providers/:id` - Update provider profile (authenticated)
- `PUT /api/providers/:id/verify` - Verify provider (admin only)
- `GET /api/providers/pending` - Get pending providers (admin only)

### User Routes
- `GET /api/users/:id` - Get user profile
- `PUT /api/users/:id` - Update user profile
- `POST /api/users/favorites` - Add to favorites
- `DELETE /api/users/favorites` - Remove from favorites

## Environment Variables

Create a `.env` file in the root directory:

```env
# MongoDB Connection
MONGO_URI=mongodb://localhost:27017/servicek

# JWT Secret
JWT_SECRET=your-secret-key-change-in-production

# Server Port
PORT=5000
```

## Running the Application

1. Start MongoDB
2. Start the backend server
3. Start the frontend development server
4. Access the application at `http://localhost:5173`

## Testing Credentials

After seeding the database, you can use these credentials:

**Provider Accounts:**
- Email: `ahmed@example.com` / Password: `password123`
- Email: `fatma@example.com` / Password: `password123`
- Email: `mohamed@example.com` / Password: `password123`
- Email: `leila@example.com` / Password: `password123`
- Email: `karim@example.com` / Password: `password123`
- Email: `sonia@example.com` / Password: `password123`

## Project Structure

```
/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── server.ts
│   │   └── seeder.ts
│   ├── package.json
│   └── tsconfig.json
│
├── src/
│   ├── components/
│   ├── contexts/
│   ├── hooks/
│   ├── lib/
│   ├── pages/
│   └── App.tsx
│
├── .env
├── package.json
└── README.md
```

## Deployment

For production deployment:
1. Build the backend: `cd backend && npm run build`
2. Build the frontend: `npm run build`
3. Configure your production server to serve both the backend and frontend
4. Set up proper environment variables
5. Use a production-ready MongoDB instance

## License

This project is for educational purposes.
