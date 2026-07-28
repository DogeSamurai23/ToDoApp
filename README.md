# 📑 Taskly — Editorial To-Do Companion

A modern, Substack-inspired full-stack task management application crafted with **React Native**, **Node.js**, **TypeScript**, **Express**, and **MongoDB Atlas**. Built with warm editorial aesthetics, zero-delay optimistic UI updates, native Android system notifications, and secure JWT-based authentication.

---

## 🎨 Design Philosophy & Aesthetics

Taskly breaks away from typical corporate task apps by adopting a warm, Substack-inspired editorial aesthetic:
- **Palette**: Warm Cream (`#F4EAE1`), Dark Burgundy (`#43252B`), Accent Rust (`#C85A32`), and Muted Taupe (`#B29B90`).
- **Typography**: Elegant Serif headers paired with clean Sans-serif body typography.
- **Custom Branding**: Tailored dark burgundy Taskly app launcher icon (`✓`) across high-density Android mipmaps.
- **Edge-to-Edge Responsiveness**: Custom dynamic safe-area insets (`react-native-safe-area-context`) ensuring pixel-perfect headers and custom floating pill-shaped bottom tab navigation across notched and gesture-based screens.

---

## 🛠️ Full Tech Stack

### **Mobile App (Frontend)**
- **Framework**: React Native 0.86 (TypeScript)
- **Navigation**: React Navigation v6 (`@react-navigation/bottom-tabs`, `@react-navigation/native-stack`) with custom pill-style tab bar.
- **State & Data Fetching**: Redux Toolkit & **RTK Query**
  - **Optimistic Updates**: 0ms instant UI feedback for task toggling and deletion with automatic background sync.
  - **Automatic Token Handling**: Intercepts unauthorized responses to manage JWT access session state.
- **Native Notifications**: `@notifee/react-native` for high-importance Android status-bar and lock-screen system reminders.
- **UI Components & Security**: Interactive password eye visibility toggle (`👁️`), `@react-native-community/datetimepicker`, `@react-native-async-storage/async-storage`.

### **Backend API**
- **Runtime & Language**: Node.js + TypeScript (`dist/index.js`)
- **Framework**: Express.js REST API with clean modular MVC architecture.
- **Validation & Security**: `express-validator`, `bcryptjs` (salt rounds = 10), CORS.
- **Database**: MongoDB Atlas (Cloud) with **Mongoose ODM**.

### **Infrastructure & Hosting**
- **Database Cloud**: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (M0 Cloud Cluster).
- **Backend Cloud**: [Render.com](https://render.com) (24/7 Web Service).

---

## 🔐 Authentication Architecture (JWT Access & Refresh Tokens)

Taskly implements a multi-token JWT authentication flow to ensure high security and seamless user sessions:

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
   │ (Stores tokens in AsyncStorage & attaches Bearer header for protected routes)
```

### Key Security Features:
1. **Access Token**: Short-lived JWT signed with `JWT_SECRET` sent in the `Authorization: Bearer <token>` HTTP header for protected API routes.
2. **Refresh Token**: Long-lived JWT signed with `JWT_REFRESH_SECRET` stored in device `AsyncStorage` to acquire new access tokens without prompting re-login.
3. **Password Security**: Passwords are hashed using `bcryptjs` before storage in MongoDB.
4. **Eye Toggle**: Interactive password visibility toggle button on Login & Register screens.
5. **Session Isolation**: Dispatches `baseApi.util.resetApiState()` on logout or account switch, purging cached query data from memory.

---

## ⚡ Core Features

- 🔔 **Native System Notifications**: Scheduled Android lock-screen and status-bar alerts using `@notifee/react-native` (At Deadline, 15m Before, 1h Before, 1d Before).
- 👁️ **Password Eye Toggle**: Easily reveal or hide passwords on authentication screens.
- ⏱️ **Instant (0ms) Task Toggling**: Checkbox state flips immediately on touch via RTK Query optimistic updates.
- 🚫 **Past Date Validation**: Prevents scheduling tasks or setting deadlines in the past with inline error indicators.
- ✨ **Recommended Sorting Algorithm**: Automatically ranks tasks based on overdue state, imminent deadlines, and critical priority levels.
- 🔍 **Real-time Search & Multi-Filtering**: Filter tasks by priority (*Critical, High, Medium, Low*), status (*Pending, Completed*), or search by title/description.
- 📱 **Edge-to-Edge UI Layout**: Tailored top header padding and floating bottom navigation tab bar designed for all screen sizes.

---

## 📦 Project Structure

```text
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB Mongoose database connection
│   │   ├── controllers/     # Auth and Task controller handlers
│   │   ├── middleware/      # JWT auth guard & express-validator
│   │   ├── models/          # Mongoose schemas (User, Task)
│   │   ├── routes/          # Express REST routes (/auth, /tasks)
│   │   ├── utils/           # JWT sign/verify helper utilities
│   │   └── index.ts         # Express server entry point
│   ├── package.json
│   └── tsconfig.json
│
└── mobile/
    ├── src/
    │   ├── api/             # RTK Query base API & endpoints
    │   ├── components/      # TaskCard & reusable UI components
    │   ├── navigation/      # Root & App navigators with CustomTabBar
    │   ├── screens/         # Home, TaskDetail, AddTask, Profile, Login, Register
    │   ├── store/           # Redux store & auth/tasks slices
    │   ├── theme/           # Substack color tokens, typography & spacing
    │   └── utils/           # Native Notifications & task sorting helpers
    ├── App.tsx
    └── package.json
```

---

## 🚀 Environment Variables

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/todo-app?retryWrites=true&w=majority
JWT_SECRET=your_jwt_access_secret_key_2026
JWT_REFRESH_SECRET=your_jwt_refresh_secret_key_2026
NODE_ENV=production
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
