# Build stage
FROM node:22-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
# Copy the built assets
COPY --from=build /app/dist /usr/share/nginx/html
# Expose port 8080 (Cloud Run default)
EXPOSE 8080
# Copy custom nginx config to use port 8080 and handle client-side routing
RUN echo 'server { listen 8080; location / { root /usr/share/nginx/html; index index.html index.htm; try_files $uri $uri/ /index.html; } }' > /etc/nginx/conf.d/default.conf
CMD ["nginx", "-g", "daemon off;"]
