# EventHub — Event Management Platform

Full-stack event management application where users can create, browse, join, and manage events.

## Tech Stack

- **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, shadcn/ui, Zustand, React Query, Framer Motion
- **Backend:** NestJS (REST API), TypeORM, PostgreSQL, Swagger (API docs)
- **Database:** Supabase (PostgreSQL + Auth + Storage + RLS)
- **Deployment:** Docker, Vercel, Lovable Cloud

## Features

- 🔐 Email/password authentication with email verification
- 📅 Event CRUD: create, read, update, delete events
- 👥 Event registration (join/leave) with capacity limits
- 📆 Calendar view (month & week) on My Events page
- 🔒 Public/Private event visibility
- 🔍 Search and category filtering
- 👤 User profiles with avatar upload
- 📊 Participant list with names/initials
- ⚠️ Delete confirmation modal
- 📅 Calendar date picker (no past dates)
- 🗂️ Pagination with navigation controls

## Getting Started

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- npm or bun

### Local Development

```bash
# Clone the repository
git clone <YOUR_GIT_URL>
cd <YOUR_PROJECT_NAME>

# Install frontend dependencies
npm install

# Start the frontend dev server
npm run dev
```

### Docker (Full Stack)

```bash
# Start all services (frontend, backend, database)
docker-compose up --build

# Frontend: http://localhost:3000
# Backend API: http://localhost:4000/api
# Swagger docs: http://localhost:4000/api/docs
```

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
# Frontend
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-anon-key>

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/eventdb
JWT_SECRET=your-jwt-secret
SUPABASE_URL=<your-supabase-url>
SUPABASE_SERVICE_ROLE_KEY=<your-service-key>
```

### Database Seeding

```bash
# Seed the database with 2 test users and 3 sample events
cd backend
npx ts-node seed.ts
```

**Test accounts:**
- `alice@example.com` / `Password123!`
- `bob@example.com` / `Password123!`

## API Endpoints

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/events` | List all events (with filters) | No |
| GET | `/api/events/:id` | Get event details | No |
| POST | `/api/events` | Create new event | Yes |
| PUT | `/api/events/:id` | Update event | Yes (organizer) |
| DELETE | `/api/events/:id` | Delete event | Yes (organizer) |
| POST | `/api/events/:id/join` | Join event | Yes |
| POST | `/api/events/:id/leave` | Leave event | Yes |
| GET | `/api/events/users/me/events` | My events (organized + joined) | Yes |
| POST | `/api/auth/register` | Register | No |
| POST | `/api/auth/login` | Login | No |

## Project Structure

```
├── src/                  # Frontend (React + Vite)
│   ├── components/       # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── pages/            # Page components
│   ├── store/            # Zustand stores
│   └── types/            # TypeScript types
├── backend/              # Backend (NestJS)
│   └── src/
│       ├── auth/         # Authentication module
│       └── events/       # Events module
├── docker/               # Docker configs
├── supabase/             # Supabase config & migrations
└── docker-compose.yml    # Docker Compose orchestration
```

## Deployment

Deploy via [Lovable](https://lovable.dev) → Share → Publish, or self-host with Docker.
