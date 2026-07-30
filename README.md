# ⚽ Premier Zone

A full-stack Premier League web application built with **Spring Boot**, **React**, **Vite**, and **PostgreSQL**.

Premier Zone allows users to browse Premier League players and clubs, filter and search player statistics, compare players, and build fantasy squads through a modern web interface.

---

## ✨ Features

- Browse Premier League players
- Search players by name
- Filter players by club
- Filter players by position
- Server-side pagination
- View detailed player information
- Explore club squads
- Compare player statistics
- Build a fantasy football team
- Responsive React interface
- REST API powered by Spring Boot
- PostgreSQL database integration

---

## 🛠️ Tech Stack

### Backend

- Java 21
- Spring Boot
- Spring Data JPA
- Maven
- PostgreSQL
- REST APIs

### Frontend

- React
- Vite
- React Router
- Axios
- JavaScript
- CSS

### Development Tools

- Git
- GitHub
- IntelliJ IDEA
- Visual Studio Code
- Postman
- PostgreSQL / psql

---

## 🏗️ Architecture

```text
React + Vite Frontend
        │
        │ HTTP / JSON
        ▼
Spring Boot REST API
        │
        │ Spring Data JPA
        ▼
PostgreSQL Database
```

---

## 📁 Project Structure

```text
premier-zone/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── api/
│   │   ├── assets/
│   │   ├── components/
│   │   └── pages/
│   ├── package.json
│   └── vite.config.js
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/pl/premier_zone/
│   │   └── resources/
│   └── test/
│
├── pom.xml
├── mvnw
├── mvnw.cmd
└── README.md
```

---

## 📸 Application Pages

Premier Zone currently includes:

- Home page
- Players page
- Player details page
- Teams page
- Team details page
- Player comparison page
- Fantasy team builder

### Screenshots

Screenshots and a live demo will be added as the project continues to develop.

---

## ⚙️ Getting Started

### Prerequisites

Install the following:

- Java 21
- Node.js
- npm
- PostgreSQL
- Git

---

## 🗄️ Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE fantasy_pl;
```

Create the local configuration file:

```text
src/main/resources/application.properties
```

Example configuration:

```properties
spring.application.name=premier-zone

spring.datasource.url=jdbc:postgresql://localhost:5432/fantasy_pl
spring.datasource.username=postgres
spring.datasource.password=YOUR_DATABASE_PASSWORD

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.open-in-view=false
```

Do not commit your real database password.

---

## ▶️ Run the Backend

From the project root:

### Windows

```powershell
.\mvnw.cmd spring-boot:run
```

### macOS or Linux

```bash
./mvnw spring-boot:run
```

The backend will run at:

```text
http://localhost:8080
```

---

## ▶️ Run the Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run at:

```text
http://localhost:5173
```

---

## 📡 API Endpoints

Examples:

```http
GET /api/v1/player
GET /api/v1/player/paged
```

The paginated endpoint supports filters such as:

```http
GET /api/v1/player/paged?page=0&size=24
GET /api/v1/player/paged?name=haal
GET /api/v1/player/paged?team=Arsenal
GET /api/v1/player/paged?position=FW
```

Filters can also be combined:

```http
GET /api/v1/player/paged?team=Arsenal&position=FW&name=gab
```

---

## 🧭 Roadmap

Planned improvements include:

- Spring Security
- JWT authentication
- User registration and login
- Protected routes
- Favorite players
- Saved fantasy teams
- User dashboard
- Sorting and advanced filtering
- Player statistics charts
- Swagger/OpenAPI documentation
- Automated testing
- Docker support
- CI/CD with GitHub Actions
- Cloud deployment

---

## 🎯 Project Goals

Premier Zone was created to strengthen practical knowledge of:

- Full-stack application development
- REST API design
- Spring Boot architecture
- React component design
- PostgreSQL database integration
- Server-side pagination
- Search and filtering
- Git and GitHub workflows
- Authentication and authorization
- Application deployment

---

## 👨‍💻 Developer

**Syed Owais Haider Kazmi**

Computer Science student at the University of New Brunswick with an interest in backend development, full-stack engineering, cloud technologies, and software development.

GitHub: [kazmisahab110](https://github.com/kazmisahab110)

---

## 📄 License

This project is currently provided for educational and portfolio purposes.

---

## ⭐ Support

If you find this project interesting, consider giving the repository a star.