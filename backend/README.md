
---

## ⚙️ `backend/README.md`

```markdown
# ⚙️ Backend – Themed Todo Workspace

Backend implemented with **Spring Boot 3** (Java 21).  
Provides RESTful APIs, authentication, and theming persistence.

---

## 🧩 Features
- 🔐 OAuth2 (Google/GitHub) + JWT authentication
- 🧠 RESTful API for todos, workspaces, and themes
- 🧩 Database integration with PostgreSQL (Spring Data JPA)
- 🔁 Server-Sent Events (SSE) for live updates
- 🧾 API documentation via OpenAPI/Swagger
- ⚙️ CI/CD and Dockerized deployment

---

## 🧱 Stack
| Category | Tech |
|-----------|------|
| Framework | Spring Boot 3 |
| Language | Java 21 |
| Auth | Spring Security (OAuth2 + JWT) |
| Database | PostgreSQL |
| ORM | Spring Data JPA / Hibernate |
| Migration | Flyway |
| Build | Gradle |
| Testing | JUnit 5, Mockito, REST Assured, Testcontainers |
| Docs | springdoc-openapi |
| Real-time | SSE (Server-Sent Events) |
| Deployment | Render / Fly.io |
| Container | Dockerfile |

---

## 📦 Entities
User (id, email, name, avatarUrl)
Workspace (id, name, ownerId)
Todo (id, title, done, dueAt, workspaceId)
Theme (id, workspaceId, mode, primary, accent, radius)

## 📡 API Endpoints

| Method | Endpoint | Description |
|---------|-----------|-------------|
| POST | `/api/auth/login` | JWT login |
| GET | `/api/me` | Current user info |
| GET | `/api/workspaces` | List workspaces |
| POST | `/api/workspaces` | Create workspace |
| GET | `/api/todos?workspaceId=` | List todos |
| POST | `/api/todos` | Create todo |
| PATCH | `/api/todos/{id}` | Update todo |
| DELETE | `/api/todos/{id}` | Delete todo |
| GET | `/api/theme?workspaceId=` | Get workspace theme |
| PUT | `/api/theme` | Update theme |
| GET | `/api/stream?workspaceId=` | SSE live updates |

---

## 🧰 Setup

### Run locally
```bash
# Run with Docker Compose (recommended)
docker compose up -d db 
```
Swagger UI:
http://localhost:8080/swagger-ui/index.html

OpenAPI spec:
http://localhost:8080/v3/api-docs

MIT © 2025 Jasmine Tam