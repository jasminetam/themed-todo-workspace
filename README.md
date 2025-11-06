# 🗂️ Themed Todo Workspace

A full-stack **Todo Workspace** app where users can manage tasks, customize their workspace themes, and collaborate in real-time.  
Built with **Next.js (TypeScript)** on the frontend and **Spring Boot (Java 21)** on the backend.

---

## 🌍 Overview

The app demonstrates scalable full-stack architecture with:
- **Workspace-based theming** (light/dark, color, radius)
- **JWT/OAuth2 authentication**
- **Optimistic UI updates** with React Query
- **Real-time sync** via Server-Sent Events (SSE)
- **Enterprise-grade backend** using Spring Boot and PostgreSQL
- **Dockerized environment** for easy setup and CI/CD

---

## 🧱 Tech Stack

| Layer | Technologies |
|-------|---------------|
| **Frontend** | Next.js, React, TypeScript, Tailwind CSS, React Query, React Hook Form, Zod |
| **Backend** | Spring Boot 3, Spring Security (OAuth2 + JWT), Spring Data JPA, Flyway, PostgreSQL |
| **Database** | PostgreSQL |
| **Testing** | Frontend: Jest + Playwright · Backend: JUnit5 + Testcontainers |
| **DevOps** | Docker, GitHub Actions, Vercel (FE), Render/Fly.io (BE) |

---

## 🧩 Core Features
- 🔐 OAuth2 login (Google/GitHub)
- 📝 CRUD operations for todos
- 🎨 Custom workspace theming
- 🧠 Optimistic UI & caching
- 🔁 Real-time updates via SSE
- 📜 OpenAPI documentation (springdoc)
- ⚙️ CI/CD pipelines with Docker and GitHub Actions

---

## 🧮 Architecture
frontend (Next.js) ──────► REST API (Spring Boot)
▲ │
│ ▼
React Query PostgreSQL
Theming + UI Data Persistence

---

## 🧪 Local Development

```bash
# 1. Clone repository
git clone 
cd themed-todo-workspace

# 2. Start everything
docker compose up
```
