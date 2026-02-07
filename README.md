# Quiz Builder

A full-stack quiz creation platform built with Nest.js, Next.js, and Prisma.

## Project Structure

- `backend/`: Nest.js API with Prisma
- `frontend/`: Next.js Web App with Tailwind CSS

## Prerequisites

- Node.js (v20+)
- PostgreSQL database

## Getting Started

### 1. Database Setup

1. Create a PostgreSQL database(Neon will probably be the easiest way).
2. Navigate to `backend/`.
3. Create a `.env` file from the provided schema:
   ```env
   DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE"
   ```
4. Run migrations:
   ```bash
   npx prisma migrate dev --name init
   ```

### 2. Backend Setup

1. Install dependencies:
   ```bash
   cd backend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run start:dev
   ```
   The backend will run on `http://localhost:3001`.

### 3. Frontend Setup

1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:3000`.

## Features

- **Dashboard**: View all quizzes and their question counts.
- **Dynamic Creation**: Build quizzes with Boolean, Short Answer, and Multiple Choice questions.
- **Detail View**: Inspect quiz structure in a read-only mode.
- **Deletion**: Remove quizzes directly from the dashboard.
