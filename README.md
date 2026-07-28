# 📑 Taskly — Express Node.js & MongoDB Backend API

A modern, high-performance REST API backend for the **Taskly** task management application built with **Node.js**, **Express**, **TypeScript**, and **MongoDB Atlas**. Built with clean MVC architecture, secure JWT authentication (Access & Refresh tokens), password hashing (`bcryptjs`), and request validation.

---

## 🛠️ Tech Stack & Dependencies

- **Runtime & Language**: Node.js + TypeScript
- **Framework**: Express.js REST API
- **Database**: MongoDB Atlas (Cloud) with **Mongoose ODM**
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) with Access & Refresh token rotation
- **Security & Validation**: `bcryptjs` (salt rounds = 10), `express-validator`, `cors`
- **Hosting**: Deployed 24/7 on [Render.com](https://render.com)

---

## 🔐 Authentication Architecture (JWT Access & Refresh Tokens)

Taskly implements a secure multi-token JWT authentication flow:

```text
📱 Mobile App
   │ (User submits Email & Password)
   ▼
⚡ Express REST API
   │ (Verifies credentials & bcrypt password hash)
   ▼
☁️ MongoDB Atlas Cloud Database
   │ (Queries user record and verifies data integrity)
   ▼
🔑 Express REST API
   │ (Issues signed JWT Access Token & Refresh Token)
   ▼
📱 Mobile App
   │ (Stores tokens securely & attaches Bearer header for protected routes)
```

### Key Security Features:
1. **Access Token**: Short-lived JWT signed with `JWT_SECRET` sent in the `Authorization: Bearer <token>` HTTP header for protected API routes.
2. **Refresh Token**: Long-lived JWT signed with `JWT_REFRESH_SECRET` to acquire new access tokens without prompting re-login.
3. **Password Security**: Passwords are hashed using `bcryptjs` before storage in MongoDB.
4. **Validation**: All incoming request bodies are validated using `express-validator` middleware.

---

## 📂 Project Structure

```text
├── src/
│   ├── config/          # MongoDB Mongoose database connection
│   ├── controllers/     # Auth and Task controller handlers
│   ├── middleware/      # JWT auth guard & express-validator
│   ├── models/          # Mongoose schemas (User, Task)
│   ├── routes/          # Express REST routes (/auth, /tasks)
│   ├── utils/           # JWT sign/verify helper utilities
│   └── index.ts         # Express server entry point
├── .env.example         # Environment variables template
├── .gitignore           # Git ignore rules
├── README.md            # Project documentation
├── nodemon.json         # Development server config
├── package-lock.json    # Dependency lockfile
├── package.json         # Project dependencies & scripts
└── tsconfig.json        # TypeScript compiler configuration
```

---

## ⚙️ Environment Setup

1. Copy `.env.example` to create your local `.env` file:
   ```bash
   cp .env.example .env
   ```

2. Fill in your environment variables in `.env`:
   ```env
   PORT=5000
   MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo-app?retryWrites=true&w=majority
   JWT_SECRET=your_jwt_access_secret_key_2026
   JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_2026
   NODE_ENV=production
   ```

---

## 🚀 Running Locally

```bash
# Install dependencies
npm install

# Build TypeScript to dist/
npm run build

# Start production server
npm start

# Development mode with hot-reload
npm run dev
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
