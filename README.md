# 💬 Social Media API

A scalable, modular **Social Media Backend** built with **NestJS**, supporting both **real-time communication** and traditional REST/GraphQL interactions. Built with microservices, gRPC, and WebSockets, it provides real-time chat, friend/follow systems, and a foundation for modern social features.

---

## 📌 Table of Contents

* [Features](#features)
* [Tech Stack](#tech-stack)
* [Architecture](#architecture)
* [Getting Started](#getting-started)
* [Microservices Overview](#microservices-overview)
* [Gateway API](#gateway-api)
* [Authentication](#authentication)
* [Real-time Communication](#real-time-communication)
* [API Documentation](#api-documentation)
* [Usage Examples](#usage-examples)
* [Planned Features](#planned-features)
* [Project Structure](#project-structure)
* [Contributing](#contributing)
* [License](#license)

---

## ✨ Features

* 🧱 Microservices architecture with gRPC
* 🌐 REST + GraphQL API support
* 🔐 Auth system with JWT and RBAC
* 🧑‍🤝‍🧑 Follow/friend request system
* 💬 1-on-1 and group chat support with Socket.IO
* 📥 Group join requests with admin approval
* 📌 Real-time messaging using WebSockets
* 🔔 Notification support (via Redis pub/sub)

---

## 🛠 Tech Stack

| Layer             | Tech Used                               |
| ----------------- | --------------------------------------- |
| Backend Framework | NestJS                                  |
| API Protocols     | REST, GraphQL, gRPC                     |
| Real-time Engine  | WebSockets, Socket.IO                   |
| Messaging Queue   | Redis Pub/Sub                           |
| Database          | PostgreSQL                              |
| Auth              | JWT, RBAC                               |
| Containerization  | Docker, Docker Compose                  |
| DevOps            | GitHub Actions (CI/CD), Terraform (WIP) |

---

## 🏗 Architecture

\[Insert system architecture diagram here: gateway, services, Redis, WebSockets, etc.]

---

## 🚀 Getting Started

### Prerequisites

* Node.js (v18+)
* Docker & Docker Compose
* PostgreSQL
* Redis

### Clone the Repo

```bash
git clone https://github.com/iamarvy/social-media-api.git
cd social-media-api
```

### Install Dependencies

```bash
npm install
```

### Run with Docker

```bash
docker-compose up --build
```

### Run Individual Services

```bash
cd services/auth
npm run start:dev
```

---

## 🧩 Microservices Overview

| Service              | Description                              |
| -------------------- | ---------------------------------------- |
| Auth Service         | Handles sign up, login, token generation |
| User Service         | Stores user profile and connection data  |
| Post Service         | Manages posts, comments, and likes       |
| Chat Service         | Handles real-time and group messaging    |
| Notification Service | Sends real-time or async notifications   |

---

## 🌐 Gateway API

* Unified **REST and GraphQL** entry point for frontend clients
* Integrates with all microservices over gRPC
* Handles WebSocket connections for real-time communication
* Includes role and token validation middleware

---

## 🔐 Authentication

* Uses **JWT-based** auth across services
* Role-based permissions: User, Admin, Group Admin
* Token validation handled at gateway + gRPC level guards

---

## 🔄 Real-time Communication

* WebSocket gateway powered by **Socket.IO**
* Chat service emits and listens to events using Redis pub/sub
* Group messaging with join requests and admin approval
* Message persistence using PostgreSQL

---

## 📚 API Documentation

This project uses **Swagger** for automatic API documentation.

* 🧭 **Full REST Docs**: Available at `http://localhost:3000/api`
* ⚙️ **Generated via**: NestJS + Swagger module

### Sample Endpoints

| Method | Endpoint       | Description              |
| ------ | -------------- | ------------------------ |
| POST   | `/auth/signup` | Register a new user      |
| POST   | `/auth/login`  | Authenticate and get JWT |
| GET    | `/users/me`    | Fetch current user info  |
| POST   | `/posts`       | Create a new post        |

📌 For the complete list of endpoints, request/response schemas, and error formats, see the Swagger UI at `/api/docs`.

---

## 🧪 Usage Examples

### Authentication

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{ "email": "user@example.com", "password": "123456" }'
```

### Create Post

```bash
curl -X POST http://localhost:3000/posts \
  -H 'Authorization: Bearer <token>' \
  -H 'Content-Type: application/json' \
  -d '{ "text": "My first post!" }'
```

### Send WebSocket Message (via Socket.IO client)

```js
socket.emit('send_message', {
  roomId: 'abc123',
  message: 'Hello, world!',
});
```

---

## 🛠 Planned Features

* [ ] Story/Status system
* [ ] Media uploads with storage microservice
* [ ] Notification preferences & batching
* [ ] Activity logs and admin moderation tools
* [ ] Full-text post and comment search

---

## 📁 Project Structure

```bash
/services
  ├── auth/
  ├── users/
  ├── posts/
  ├── chat/
  ├── notifications/
  └── common/
/gateway
  ├── api-gateway/
/proto
  └── *.proto
/docker
  └── docker-compose.yml
```

---

## 🤝 Contributing

1. Fork this repo
2. Create a branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to your branch (`git push origin feature/my-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.
© 2025 Oluwaseyi Oke
