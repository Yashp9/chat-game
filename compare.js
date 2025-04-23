// version: "3.8"  # Define the version of Docker Compose syntax

// services:
//   backend:
//     build: ./backend  # Tells Docker to build the image using the Dockerfile inside ./backend directory
//     ports:
//       - "5001:3000"  # Maps host port 5001 -> container port 3000 (your backend listens on 3000)
//     env_file:
//       - ./backend/.env  # Loads all environment variables from this file into the container
//     volumes:
//       - ./backend:/app  # Mounts your local backend code into the container (for live dev updates)
//     restart: always  # Automatically restart the container if it crashes
//     networks:
//       - app-network  # Connects this service to a custom user-defined network for inter-service communication

//   frontend:
//     build: ./frontend  # Build frontend image from the Dockerfile inside ./frontend directory
//     ports:
//       - "8080:80"  # Host port 8080 -> container port 80 (Nginx serves frontend on port 80)
//     depends_on:
//       - backend  # Ensures backend starts first (not mandatory, but useful)
//     restart: always
//     networks:
//       - app-network  # Same network so frontend can talk to backend by its service name (like 'http://backend:3000')

// # Define a shared network for frontend and backend
// networks:
//   app-network:
//     driver: bridge  # Default network driver for local multi-container setups
