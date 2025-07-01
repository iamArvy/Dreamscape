# Chat Service

The **Chat Service** is a real-time messaging microservice built with **NestJS**, supporting both **GraphQL** and **REST API** interfaces. It allows users to initiate private conversations or group chats, send messages, delete/update them, and retrieve conversation histories. The service integrates **WebSocket (Socket.io)** for live chat and uses **Swagger** and **Apollo Playground** for API documentation and testing.

---

## 🚀 Features

* Real-time messaging using Socket.io
* Create 1-on-1 or group conversations
* Send, edit, and delete messages
* Retrieve list of conversations and message history
* REST API and GraphQL support
* API documentation via Swagger and Apollo Playground
* Modular and scalable microservice architecture

---

## 🛠️ Tech Stack

* **Framework**: [NestJS](https://nestjs.com/)
* **Authentication**: [Passport.js](https://www.passportjs.org/) & [JWT (JSON Web Tokens)](https://jwt.io/)
* **Realtime**: [Socket.io](https://www.socket.io/)
* **API**: REST, GraphQL (Apollo)
* **ORM**: [Prisma](https://www.prisma.io/) & [Mongoose](https://www.mongoose.org/)
* **Databases**: [PostgreSQL](https://www.postgresql.org/) for relational data, [MongoDB](https://www.mongodb.org/) (for document-based data)
* **API Docs**: [Swagger](https://swagger.org) for REST, [Apollo Playground](https://apollo.org) for GraphQL

---

## Getting Started

### Prerequisites

- Node.js (v20+)
- npm, yarn, or pnpm (pnpm is recommended)

### Installation

```bash
git clone https://github.com/iamArvy/chat-service.git
cd chat-service
pnpm install
```

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```
MONGO_DB_URL="your_mongodb_connection_string"
POSTGRES_DB_URL="your_mongodb_connection_string"
JWT_SECRET="your_jwt_secret"
PORT=3000
```

### Running the service

```bash
# Start the dev server
pnpm run start:dev

# Or with Docker
docker-compose up --build
```

---

## 📚 API Documentation

* **Swagger UI** (REST): [http://localhost:3000/api](http://localhost:3000/api)
* **Apollo Playground** (GraphQL): [http://localhost:3000/graphql](http://localhost:3000/graphql)

---

## 🗃️ Folder Structure (Simplified)

```
chat-service/
├── prisma/              #Contains prisma schema and migrations
├── src/
│   ├── conversation/    # Conversation logic, controller, resolver etc
│   ├── friend/          # Friend Relationship Logic (Data to be Acquired through events from User Service)
│   ├── gateway/         # WebSocket Gateway
│   ├── guards/          # Application Route Guards
│   ├── message/         # Message logic, controller, resolver etc
│   ├── participant/     # Participants logic, controller, resolver etc
│   ├── prisma/          # Prisma setup (Postgres)
│   ├── strategies/      # User Relationship Logic (Data to be acquired through events from User Service)
│   ├── app.module.ts
│   └── main.ts
├── docker-compose.yml
├── Dockerfile
├── nest-cli.json
├── package.json
├── README.md
└── tsconfig.json
```

---

## 🧱 Future Plans

* ✅ Integrate message read receipts
* ✅ Support file/media attachments
* ✅ Add SQS/Kafka for message queuing
