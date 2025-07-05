# URL URL shorcut - Full Stack Application

A complete URL shortening service built with NestJS (backend), React (frontend), and PostgreSQL.

## Features

- **Shorten URLs**: Convert long URLs into short, memorable links
- **Custom Codes**: Option to specify custom short codes
- **Redirection**: Automatic redirection to original URLs
- **REST API**: Fully documented API endpoints

## Tech Stack

### Backend

- **NestJS** - Node.js framework
- **TypeORM** - Database ORM
- **PostgreSQL** - Relational database
- **Jest** - Testing framework

### Frontend

- **React** - UI library
- **Axios** - HTTP client

## Installation

### Prerequisites

- Node.js (v16+)
- PostgreSQL (v12+)
- npm or yarn

### Backend Setup

```bash
cd backend
npm install

# Configure database in ormconfig.json
cp ormconfig.example.json ormconfig.json

# Run migrations
npm run typeorm migration:run

# Start dev server
npm run start:dev
```
