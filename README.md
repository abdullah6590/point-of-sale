# Point of Sale System

A decoupled POS application with separate **Backend** (Express + Prisma) and **Frontend** (Next.js) services.

---

## Project Structure

```
point of sale/
├── backend/          # Express API Server
│   ├── src/          # Source code
│   ├── prisma/       # Database schema
│   └── dev.db        # SQLite database
│
└── frontend/         # Next.js UI
    └── src/          # React components & pages
```

---

## Prerequisites

- **Node.js** v18+ installed
- **npm** package manager

---

## Backend Setup

### 1. Navigate to backend folder

```bash
cd backend
```

### 2. Install dependencies

```bash
cmd /c "npm install"
```

### 3. Generate Prisma Client

```bash
cmd /c "npx prisma generate"
```

### 4. Push database schema (first time only)

```bash
cmd /c "npx prisma db push"
```

### 5. Seed database with sample data (optional)

```bash
cmd /c "npx prisma db seed"
```

### 6. Start the backend server

```bash
cmd /c "npm run dev"
```

**Backend runs on:** http://localhost:3001

---

## Frontend Setup

### 1. Open a NEW terminal and navigate to frontend folder

```bash
cd frontend
```

### 2. Install dependencies

```bash
cmd /c "npm install"
```

### 3. Start the frontend server

```bash
cmd /c "npm run dev"
```

**Frontend runs on:** http://localhost:3000

---

## Running Both Services

You need **two separate terminals**:

| Terminal 1 (Backend)   | Terminal 2 (Frontend)  |
| ---------------------- | ---------------------- |
| `cd backend`           | `cd frontend`          |
| `cmd /c "npm run dev"` | `cmd /c "npm run dev"` |
| Runs on port **3001**  | Runs on port **3000**  |

---

## Database Management (Prisma)

All database commands should be run from the **backend** folder.

### View database in browser (Prisma Studio)

```bash
cmd /c "npx prisma studio"
```

Opens at http://localhost:5555

### Check schema validity

```bash
cmd /c "npx prisma validate"
```

### Reset database (WARNING: deletes all data)

```bash
cmd /c "npx prisma db push --force-reset"
```

### Re-seed database after reset

```bash
cmd /c "npx prisma db seed"
```

---

## API Endpoints

| Method | Endpoint                   | Description           |
| ------ | -------------------------- | --------------------- |
| GET    | `/api/products`            | Get all products      |
| POST   | `/api/products`            | Create a product      |
| GET    | `/api/sales`               | Get all sales         |
| POST   | `/api/sales`               | Process a sale        |
| DELETE | `/api/sales/:id`           | Delete a sale         |
| GET    | `/api/analytics/metrics`   | Get financial metrics |
| GET    | `/api/analytics/low-stock` | Get low stock items   |
| GET    | `/api/analytics/trending`  | Get trending items    |
| GET    | `/api/health`              | Health check          |

---

## Troubleshooting

### PowerShell script execution error

If you see "running scripts is disabled", use:

```bash
cmd /c "npm run dev"
```

### Port already in use

Kill the process using the port:

```bash
npx kill-port 3000
npx kill-port 3001
```

### Database connection issues

Ensure `dev.db` exists in the backend folder. If not, run:

```bash
cmd /c "npx prisma db push"
```

---

## Environment Variables

### Backend (.env)

```
PORT=3001
DATABASE_URL="file:./dev.db"
```

### Frontend (.env)

```
BACKEND_URL=http://localhost:3001/api
```
