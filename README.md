# BytePath

BytePath is a student academic planner and career guidance platform. The repository is split into two applications:

```text
backend/     Spring Boot REST API, security, persistence, and business logic
frontend/    React + Vite web application
```

## Prerequisites

- Node.js 18+ and npm 9+
- Java 17+
- Maven 3.9+

## Run locally

### Backend

```bash
cd backend
mvn spring-boot:run
```

The API runs at `http://localhost:8081`. Swagger UI is available at `http://localhost:8081/swagger-ui.html`.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The web app runs at `http://localhost:5173`.

Copy `frontend/.env.example` to `frontend/.env` when configuring a remote authentication API. Without `VITE_AUTH_API_URL`, the frontend uses its local development authentication adapter.

## Verification

```bash
cd frontend && npm run build
cd ../backend && mvn test
```

For the full production checklist, environment-variable reference, GitHub
push sequence, deployment order, smoke tests, and rollback notes, see
[`docs/PRODUCTION_RELEASE_CHECKLIST.md`](docs/PRODUCTION_RELEASE_CHECKLIST.md).

## Main backend layers

- `controller/` — HTTP endpoints
- `service/` — application and domain logic
- `model/` — JPA entities
- `repository/` — database access
- `security/` — JWT authentication and request filtering
- `config/` — Spring and OpenAPI configuration

## Main frontend layers

- `src/components/` — user-interface components
- `src/hooks/` — shared application state
- `src/services/` — authentication and advisor API clients
- `src/data/` — static curriculum data

Build output and dependencies are intentionally not committed. Maven output belongs in `backend/target/`, and Vite output belongs in `frontend/dist/`.
