# 🔥 Chat Game App (Frontend + Backend)

This is a full-stack **real-time chat game application** powered by a React frontend and a Node.js backend, containerized with **Docker** and orchestrated using **Docker Compose**.

---

## 📁 Project Structure

```
.
├── backend/               # Node.js + Express backend
│   ├── Dockerfile         # Backend Docker image
│   └── .env               # Backend environment variables
├── frontend/              # React frontend
│   ├── Dockerfile         # Frontend Docker image (production build using Nginx)
│   └── nginx.conf         # Custom Nginx config for frontend + reverse proxy
├── docker-compose.yaml    # Multi-container app orchestration
└── README.md              # You're here!
```

---

## 🚀 Features

- 🎮 Real-time chat game functionality
- ⚛️ React frontend with production Nginx setup
- 🌐 Backend API with Express
- 🐳 Dockerized for consistent environments
- ⟳ Nginx reverse proxy to route `/api` requests to backend
- 📦 One command setup with Docker Compose

---

## 🧪 Requirements

- [Docker](https://www.docker.com/)
- [Docker Compose](https://docs.docker.com/compose/)

---

## ⚙️ Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/chat-game.git
cd chat-game
```

### 2. Add Your Environment Variables

Create a `.env` file inside the `backend` directory:

```env
# backend/.env
PORT=5001
# Add your other backend environment variables
```

### 3. Start the Application

Build and run all services with one command:

```bash
docker-compose up --build
```

This will:
- Build the React frontend and serve it with Nginx
- Start the Node.js backend server
- Set up a shared network for communication
- Use Nginx as a reverse proxy to forward API calls

Access the app at: [http://localhost:8080](http://localhost:8080)

---

## 💠 Available Scripts

### Frontend (React + Nginx)
- `npm run build` – React production build (executed during Docker build)
- Custom Nginx config handles frontend routing and API proxying

### Backend (Node + Express)
- Start command defined in Dockerfile (`CMD ["npm", "start"]`)
- Live volume mapping enabled only for development (optional)

---

## 📦 Docker & Compose Breakdown

- **frontend**
  - Uses multi-stage Dockerfile for clean builds
  - Serves React app via Nginx (`nginx.conf`)
  - Port `8080` exposed

- **backend**
  - Runs on Node.js/Express
  - API served on port `5001`
  - Accessed by frontend through Nginx `/api/*` proxy

---

## 🧪 API Testing

You can test API routes via Postman:

```
GET http://localhost:8080/api/your-endpoint
```

This route is reverse proxied by Nginx to:

```
http://backend:5001/api/your-endpoint
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Yash Pandey** – Full Stack Developer  
Feel free to reach out for contributions, feedback, or collaborations!

