# TaskFlow - Modern Task Management System

TaskFlow is a production-level, responsive, and robust full-stack web application designed for task management. It is built using the MERN stack (MongoDB, Express.js, React.js, Node.js) and features a modern UI with a dynamic dashboard, role-based authentication, and real-time updates via Socket.io.

## Features

- **Authentication & Authorization**: Secure JWT-based authentication with `bcryptjs` password hashing and role-based access control (Admin, Manager, User).
- **Core Task Management**: Full CRUD capabilities with assigning functionality, priority setting, and status tracking.
- **Real-Time Updates**: Instant UI updates across clients when tasks are created, modified, or deleted using `Socket.io`.
- **Modern UI**: A responsive, dark-mode enabled dashboard built with Tailwind CSS, Redux Toolkit, and Lucide React icons.
- **Backend Architecture**: RESTful API built with Express, integrated with Mongoose models, and robust error handling.

## Project Structure

```
task-manager/
├── backend/
│   ├── src/
│   │   ├── config/          # Database configuration
│   │   ├── controllers/     # Route logic (auth, tasks)
│   │   ├── middleware/      # Auth & error handling middlewares
│   │   ├── models/          # Mongoose schemas
│   │   ├── routes/          # Express route definitions
│   │   └── utils/           # Helper functions (e.g., token generation)
│   ├── server.js            # Entry point for backend
│   └── .env                 # Environment variables (DB URI, JWT Secret)
└── frontend/
    ├── src/
    │   ├── components/      # Reusable UI components
    │   ├── pages/           # Page layouts (Login, Register, Dashboard)
    │   ├── redux/           # Redux store & slices (auth, tasks)
    │   └── index.css        # Tailwind configurations
    ├── tailwind.config.js   # Tailwind setup
    └── package.json
```

## Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas cluster (or local MongoDB)

### 1. Backend Setup
1. Open a terminal and navigate to `backend`: `cd task-manager/backend`
2. Install dependencies: `npm install`
3. Make sure the `.env` file exists with `MONGO_URI`, `JWT_SECRET`, and `PORT`.
4. Start the development server: `npm run dev` (Ensure you added the script, or just run `npx nodemon server.js`).

### 2. Frontend Setup
1. Open a terminal and navigate to `frontend`: `cd task-manager/frontend`
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. The frontend will start on `http://localhost:5173`.

## Deployment Instructions

### Frontend (Vercel)
1. Push your repository to GitHub.
2. Sign in to Vercel and create a new project.
3. Select the `frontend` root directory.
4. Framework Preset: **Vite**.
5. Deploy.

### Backend (Render/Railway)
1. In Render, create a new Web Service.
2. Select your GitHub repository.
3. Root Directory: `backend`.
4. Build Command: `npm install`.
5. Start Command: `node server.js`.
6. Add `.env` variables under the Environment tab (`MONGO_URI`, `JWT_SECRET`, etc.).
7. Deploy.

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user
- `GET /api/auth/me` - Get current user profile
- `POST /api/tasks` - Create a task
- `GET /api/tasks` - Get all tasks (supports `limit`, `page`, `status`, `priority`, `keyword`)
- `GET /api/tasks/:id` - Get single task
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task
- `POST /api/tasks/:id/comments` - Add a comment to a task
