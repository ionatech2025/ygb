# 🍊 Network for Active Citizens (NAC) — YGB Survey Tool

> **Phase 1 MVP Platform**  
> A clean, local-first field-survey collection system designed to empower regional coordinators and field collectors to securely capture community insights even when completely offline.

---

## 📋 Overview

The **YGB Survey Tool** is custom-built for the **Network for Active Citizens (NAC)** to streamline data collection at the grassroots level. The system consists of:
- 🖥️ **Desktop Admin Panel**: An intuitive dashboard for coordinators to register/manage field collectors and monitor real-time active directory entries.
- 📱 **Mobile-First Collector Portal**: Designed for mobile browsers to simulate native smartphone applications, providing offline survey registration via local caching.

The project follows a **Hexagonal (Ports & Adapters) Clean Architecture** on the backend and a component-driven, decoupled structure on the frontend.

---

## 🏗️ Project Structure

The codebase is divided into two decoupled top-level workspaces:
- [backend/](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/backend): Java 21 Spring Boot REST API project following strict Ports & Adapters architecture.
- [frontend/](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/frontend): React 18 + TypeScript + Zustand + Tailwind CSS client interface.

---

## 🛠️ Technology Stack

### Backend
- **Core Framework**: Java 21 & Spring Boot 3.3.0
- **Database Migrations**: Flyway
- **Database**: PostgreSQL 16
- **Object Mapping**: MapStruct
- **Testing**: JUnit 5, Mockito, AssertJ, and Testcontainers (PostgreSQL integration tests)

### Frontend
- **Framework & Build**: React 18 + TypeScript (Vite 8)
- **Styling**: Tailwind CSS 4 + PostCSS
- **State Management**: Zustand
- **Local Database (Offline Cache)**: Dexie.js (IndexedDB wrapper)
- **Icons & Visuals**: Lucide React & ECharts

---

## 📋 Prerequisites

Before running the application locally, ensure you have the following installed:
- **Java Development Kit (JDK) 21**
- **Maven 3.x**
- **Node.js 20.x** (with `npm` packaged)
- **Docker** & **Docker Compose** (for local PostgreSQL database instance)
- **Git**

---

## 🚀 Local Setup & Execution

### 1. Database Setup
The backend requires a PostgreSQL database to run. A pre-configured database service is provided in [backend/docker-compose.yml](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/backend/docker-compose.yml).

To spin up the local PostgreSQL database:
```bash
# Navigate to the backend directory
cd backend
# Start the database container in detached mode
docker compose up -d
```
*This starts a PostgreSQL instance on port `5432` with database `ygb_db` and user `ygb_user`.*

### 2. Running the Backend
From the [backend/](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/backend) directory:
```bash
# Compile code, run unit tests, and build target packages
mvn clean install

# Run the Spring Boot application
mvn spring-boot:run
```
*The REST API will launch on `http://localhost:8080`.*

### 3. Running the Frontend
Open a new terminal session and navigate to the [frontend/](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/frontend) directory:
```bash
# Clean install dependencies from lockfile
npm ci

# Start the Vite local development server
npm run dev
```
*The local development server will run at `http://localhost:5173`. Any calls targeting endpoint routes (e.g. `/api`) will proxy to the backend.*

---

## 📦 Deployment (Separate)

### Backend Deployment
The backend has been containerized using a multi-stage [Dockerfile](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/backend/Dockerfile).

#### 1. Build Docker Image locally
```bash
cd backend
docker build -t ygb-backend:latest .
```
#### 2. Run Docker Container locally
```bash
docker run -p 8080:8080 --env SPRING_DATASOURCE_URL=jdbc:postgresql://<DB_HOST>:5432/ygb_db ygb-backend:latest
```

#### 3. Continuous Deployment (CD)
The project utilizes GitHub Actions for continuous deployment. When changes are pushed to `main` (Production) or `dev` (Staging) branches, [cd-backend.yml](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/.github/workflows/cd-backend.yml) does the following:
- Builds the production Docker image.
- Pushes it to the GitHub Container Registry (`ghcr.io/ionatech2025/ygb-backend`).
- Triggers a webhook deployment to **Dokploy** (Staging/Production).

### Frontend Deployment
Since the frontend is a single-page application (SPA), it is compiled to static HTML/JS/CSS assets.

#### 1. Build Frontend Production Bundle
From the [frontend/](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/frontend) directory:
```bash
npm run build
```
*This command runs the TypeScript compiler `tsc -b` and Vite build pipeline, outputting static files into the `dist/` directory.*

#### 2. Serving Static Assets
- **Static Hosting (Vercel, Netlify, Render, Cloudflare Pages)**: Point the build command to `npm run build` and publish directory to `dist/`.
- **Nginx Web Server**: Copy the contents of the `dist/` folder to the Nginx root (e.g. `/usr/share/nginx/html`) and configure routing fallbacks for SPA:
  ```nginx
  location / {
      try_files $uri $uri/ /index.html;
  }
  ```

---

## ⚙️ CI/CD Pipelines

Automated pipelines run via GitHub Actions for code quality and build verification:
- **Backend CI** ([ci-backend.yml](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/.github/workflows/ci-backend.yml)): Runs on pull requests targeting `main` and `dev` containing modifications under the `backend/` path. Runs `mvn clean verify` using JDK 21.
- **Frontend CI** ([ci-frontend.yml](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/.github/workflows/ci-frontend.yml)): Runs on push and pull requests targeting `main` and `dev` containing modifications under the `frontend/` path. Installs dependencies via `npm ci`, runs linting/tests, and validates the build bundle.

---

## 🤝 Contribution Guidelines

We follow strict architecture and quality gates to keep code clean and maintainable. Please read through these guidelines before starting work:

1. **Architecture Guidelines**:
   - The backend enforces a strict Ports & Adapters Architecture. All domain models and business invariants must be pure Java and live under the domain package, isolated from Spring Boot and JPA framework dependencies. Review [CODING_STANDARDS.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/.agent/rules/CODING_STANDARDS.md) for full compliance.
   - Code files must adhere to modularity standards. Backend files should avoid exceeding **200 lines** of code. Review the modularity specifications in [GEMINI.md](file:///d:/2026/WORK/Software/sourcecode/work/web/ygb/.agent/rules/GEMINI.md).
2. **Branching Strategy**:
   - Commit and target branch: Work is integrated into the `dev` branch first (Staging environment). The `main` branch is reserved for stable production releases.
   - Always create short-lived descriptive feature branches from `dev` (e.g. `feature/issue-123-user-authentication`).
3. **Commit & Pull Requests**:
   - Write clear, concise, atomic commits.
   - Before opening a Pull Request, verify tests pass locally:
     - Backend: `mvn test`
     - Frontend: `npm run lint` and `npm run test` (if present)
   - Every Pull Request requires a reviewer sign-off and must pass all CI status checks (build, lint, test) before merging.

---

## 🔑 Testing Credentials

For demonstration and testing purposes, you can log in immediately using the following pre-configured credentials:

| Role | Phone Number | Password | Target Dashboard |
| :--- | :--- | :--- | :--- |
| **System Administrator** | `0000` | `admin` | Desktop Admin Panel |
| **Field Collector (Jane Nakato)** | `0772123456` | *(Any password)* | Mobile Survey View |

*Note: Any newly registered collector accounts you create through the Admin Panel can be logged into immediately using the phone number and password assigned to them.*

---

## 🙏 Acknowledgements

This platform is proudly developed and maintained by **iONA Tech**:
- **Allan Baliddawa** — Director & Co-Founder
- **Samuel Katongole** — Director & Co-Founder
- **Nyombi Elijah** — Director & Co-Founder
- **Nakunda Lillian** — Software Engineer
- **Mulungi Abigail** — Software Engineer
- **Mpairwe Lauben** — Software Engineer

*Helping citizens take charge of their own development.*
