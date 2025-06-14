#!/bin/bash

# Start PostgreSQL
docker-compose up -d postgres

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
sleep 5

# Initialize the database
cd backend
go run cmd/init/main.go

# Start both frontend and backend
echo "Starting frontend and backend..."
cd ../frontend && npm run dev & 
cd ../backend && go run cmd/main.go
