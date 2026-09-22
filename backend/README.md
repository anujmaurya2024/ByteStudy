# BytePath Java Spring Boot Backend

Backend REST API implementation for BytePath (B.Tech CS & IT Curriculum Navigator & Career Launchpad) built with **Spring Boot 3**, **Spring Security (JWT)**, and **Spring Data JPA**.

---

## 🛠️ Tech Stack & Features

- **Java 17 / Spring Boot 3.2.5**
- **Spring Security + JWT (HMAC-SHA256)**: Secure token-based authentication and role-based permissions (`ROLE_STUDENT`, `ROLE_ADMIN`).
- **Spring Data JPA & PostgreSQL**: PostgreSQL with Flyway migrations for local and production deployments.
- **REST Endpoints**:
  - `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/google`
  - `GET /api/academic/profile`, `PUT /api/academic/profile`, `GET /api/academic/cgpa`, `GET/PUT /api/academic/semesters/**`
  - `GET/POST/DELETE /api/attendance/**`, `GET /api/attendance/summary`
  - `GET/POST/PUT/DELETE /api/deadlines/**`
  - `GET/POST/PUT/DELETE /api/expenses/**`, `GET/PUT /api/expenses/budget`
  - `GET/POST/DELETE /api/focus/**`
  - `GET/PUT/DELETE /api/gradesim/**`
  - `GET/POST/DELETE /api/advisor/chat` (ByteAI Rule-Based Study Advisor)
  - `GET /api/syllabus/**`, `GET /api/syllabus/career/**`
  - `GET/POST/DELETE /api/pyqs/**` (Admin upload & public query)
- **OpenAPI 3 / Swagger UI**: Interactive API documentation at `/swagger-ui.html`.

---

## 🚀 How to Run the Java Backend

### Prerequisites
- JDK 17 or newer installed (`java -version`)
- Apache Maven installed (`mvn -version`)

### 1. Build and Run
From the repository root:
```bash
# Navigate to backend directory
cd backend

# Build project and run tests
mvn clean package

# Run the Spring Boot application
mvn spring-boot:run
```

### 2. Access Swagger UI
Once started (port `8081`):
- **Swagger Documentation**: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)

---

## 🔗 Connecting the React Frontend to Java Backend

In `frontend/.env`, set:
```env
VITE_AUTH_API_URL=http://localhost:8081/api
```
For Google sign-in, also set `VITE_GOOGLE_CLIENT_ID` in the frontend `.env` and
provide that same public value as `GOOGLE_CLIENT_ID` to the backend process. The
root `START.bat` does this automatically. When starting Spring Boot from an IDE,
add `GOOGLE_CLIENT_ID` to that run configuration's environment variables.

In a separate terminal, from the repository root, run the frontend:
```bash
cd frontend
npm run dev
```
