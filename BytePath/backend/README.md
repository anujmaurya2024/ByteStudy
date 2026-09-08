# BytePath Java Spring Boot Backend

Backend REST API implementation for BytePath (B.Tech CS & IT Curriculum Navigator & Career Launchpad) built with **Spring Boot 3**, **Spring Security (JWT)**, and **Spring Data JPA**.

---

## 🛠️ Tech Stack & Features

- **Java 17 / Spring Boot 3.2.5**
- **Spring Security + JWT (HMAC-SHA256)**: Secure token-based authentication and role-based permissions (`ROLE_STUDENT`, `ROLE_ADMIN`).
- **Spring Data JPA & H2 Database**: In-memory database for local zero-setup development, ready for MySQL in production.
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
From the `backend/` folder:
```bash
# Navigate to backend directory
cd backend

# Build project and run tests
mvn clean package

# Run the Spring Boot application
mvn spring-boot:run
```

### 2. Access Swagger UI & H2 Console
Once started (port `8080`):
- **Swagger Documentation**: [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)
- **H2 Database Console**: [http://localhost:8080/h2-console](http://localhost:8080/h2-console)
  - JDBC URL: `jdbc:h2:mem:bytepathdb`
  - Username: `sa`
  - Password: *(leave blank)*

---

## 🔗 Connecting the React Frontend to Java Backend

In your frontend root directory, set `.env`:
```env
VITE_AUTH_API_URL=http://localhost:8080/api
```
Run the frontend:
```bash
npm run dev
```
