# Stage 1: Build the Go binary
FROM golang:1.22.3-alpine AS builder

# Set necessary environment variables for Go
ENV CGO_ENABLED=0
ENV GOOS=linux
ENV GOARCH=amd64

# Create a working directory
WORKDIR /app

# Copy go.mod and go.sum files for dependency resolution
COPY go.mod go.sum ./

# Download dependencies (ensures they are cached)
RUN go mod download

# Copy the rest of the source code
COPY . .


RUN go build -o pgosb_web_app

# Stage 2: Create the final runtime image
FROM alpine:latest

# Set working directory
WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /app/pgosb_web_app .
COPY config/appsettings.json /app/config/appsettings.json 
COPY config/gres.local.net.pem /app/config/gres.local.net.pem 
COPY config/gres.local.net-key.pem /app/config/gres.local.net-key.pem


# (Optional) Copy any static files or configuration if needed
# COPY public ./public
# COPY config.json ./config.json

# Expose the port your server listens on (replace with your actual port)
EXPOSE 8083

# Define the command to run your application
CMD ["./pgosb_web_app"]