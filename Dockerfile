# Stage 0, "build-stage", based on Node.js, to build and compile the frontend
FROM node:14 as build-stage
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY ./ /app/
ARG REACT_APP_PARSE_SERVER_APPLICATION_ID
ARG REACT_APP_PARSE_SERVER_URL
RUN echo "REACT_APP_PARSE_SERVER_APPLICATION_ID="$REACT_APP_PARSE_SERVER_APPLICATION_ID >> /app/.env
RUN echo "REACT_APP_PARSE_SERVER_URL="$REACT_APP_PARSE_SERVER_URL >> /app/.env
RUN npm run build
# Stage 1, based on Nginx, to have only the compiled app, ready for production with Nginx
FROM nginx:1.15
COPY --from=build-stage /app/build/ /usr/share/nginx/html
# Copy the default nginx.conf provided by tiangolo/node-frontend
COPY --from=build-stage /app/nginx.conf /etc/nginx/conf.d/default.conf