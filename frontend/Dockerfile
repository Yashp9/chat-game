# # Stage 1: Build the React (Vite) app
# FROM node:20 AS builder

# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# # Stage 2: Serve with Nginx
# FROM nginx:stable-alpine

# # Copy custom nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Copy built static files from previous stage
# COPY --from=builder /app/dist /usr/share/nginx/html

# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]




#new Dockerfile

#stage 1 build the frontend app
FROM node:18 AS builder

WORKDIR /app

#copy packages files and install dependencies
COPY package*.json ./
RUN npm install

#copy the rest of the source code and build it
COPY . .
RUN npm run build

#stage 2: serve with nginx
FROM nginx:alpine

#copy built frontend files from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

#copy custom Nginx config for reverse proxy
COPY nginx.conf /etc/nginx/conf.d/default.conf

#expose nginx port 
EXPOSE 80


