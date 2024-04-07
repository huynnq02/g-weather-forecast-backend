# Use an official Node.js runtime as a base image
FROM node

# Set the working directory in the container
WORKDIR /app


# Copy the rest of the application code to the working directory

COPY package*.json ./


# Download dependencies as a separate step to take advantage of Docker's caching.
# Leverage a cache mount to /root/.npm to speed up subsequent builds.
# Leverage a bind mounts to package.json and package-lock.json to avoid having to copy them into
# into this layer.
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci --omit=dev

COPY . .

# Expose a port for the application to listen on
EXPOSE 3000

# Define the command to run your application
CMD ["npm", "run", "start"]