#!/bin/bash

# Development environment setup script
# This script manages both frontend and backend services

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if backend folder exists
if [ ! -d "backend" ]; then
    echo -e "${YELLOW}Backend folder not found${NC}"
    echo "Please ensure backend folder exists with SQLModel files"
    exit 1
fi

case "$1" in
    start)
        echo -e "${GREEN}Starting development environment...${NC}"

        # Start backend
        echo "Starting backend..."
        cd backend
        python3 -m fastapi dev main_sqlmodel.py --port 8011 &
        BACKEND_PID=$!
        cd - > /dev/null

        # Start frontend
        echo "Starting frontend..."
        npm run dev &
        FRONTEND_PID=$!

        echo -e "${GREEN}Services started!${NC}"
        echo "Frontend: http://localhost:3007"
        echo "Backend API: http://localhost:8011"
        echo "API Docs: http://localhost:8011/docs"

        # Wait for both processes
        wait $BACKEND_PID $FRONTEND_PID
        ;;

    stop)
        echo -e "${RED}Stopping services...${NC}"
        pkill -f "fastapi dev" || true
        pkill -f "vite" || true
        echo "Services stopped."
        ;;

    logs)
        if [ "$2" == "backend" ]; then
            tail -f backend/logs/*.log 2>/dev/null || echo "No backend logs found"
        elif [ "$2" == "frontend" ]; then
            npm run dev
        else
            echo "Usage: $0 logs [backend|frontend]"
        fi
        ;;

    test)
        echo -e "${YELLOW}Running tests...${NC}"
        # Frontend tests
        npm test

        # Backend tests
        cd backend
        python -m pytest
        cd - > /dev/null
        ;;

    *)
        echo "Usage: $0 {start|stop|logs|test}"
        echo ""
        echo "Commands:"
        echo "  start  - Start both frontend and backend services"
        echo "  stop   - Stop all services"
        echo "  logs   - Show logs (specify backend or frontend)"
        echo "  test   - Run tests for both services"
        exit 1
        ;;
esac