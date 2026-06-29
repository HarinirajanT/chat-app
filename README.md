# Real-Time Chat Website

MERN stack chat application with JWT authentication and WebSockets for real-time messaging.

## Live Demo

**https://harinirajant.github.io/chat-app/**

Demo login: `alice` / `demo123` (also try `bob` or `charlie`)

GitHub: https://github.com/HarinirajanT/chat-app

---

## Features

- User registration & login
- Real-time messaging via Socket.io
- Message history
- Online user indicators

## Tech Stack

**Frontend:** React · Vite · Socket.io Client · Tailwind CSS · DaisyUI  
**Backend:** Node.js · Express · Socket.io · MongoDB · JWT

## Run locally (full stack)

```bash
# Terminal 1 — backend (requires MongoDB)
npm install
npm run server

# Terminal 2 — frontend
cd front_end && npm install && npm run dev
```

## Run frontend demo only

```bash
cd front_end
npm install
VITE_DEMO_MODE=true npm run dev
```

---

Harini T · harinirajan2004t@gmail.com
