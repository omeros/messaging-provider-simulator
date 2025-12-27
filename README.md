Messaging Provider Simulator (Full-Stack Home Assignment)

A small full-stack “Messaging System” that simulates sending messages via an external provider.
It demonstrates integration patterns such as provider abstraction, async workflows, retries, and idempotent request handling (no duplicate messages on repeated requests).

Tech Stack

Client: React + TypeScript + Vite + TailwindCSS

Server: Node.js + Express

Storage: In-memory (no database)

Features
Backend (Node.js / Express)

POST /messages/send
Creates a message and triggers sending via a provider abstraction.

GET /messages
Returns the in-memory list of messages.

Provider abstraction with a Fake Provider:

Random delay (simulates network latency)

Random failures (simulates unreliable external service)

Reliability

Retry failed sends (with configurable attempts/delay)

Idempotency: repeated identical requests (same idempotency key) are processed only once, returning the existing message instead of creating duplicates

Logging to console on status changes (e.g. pending → sending → sent/failed)

Frontend (React)

Home page: basic navigation

Send page: form to send a message

Messages page: list messages + status (manual refresh / optional polling)

Project Structure (example)
client/
  src/
    pages/
    components/
    services/
server/
  routes/
  controllers/
  services/
  providers/

Running the Project
1) Backend (PORT 3001)
cd server
npm install
npm start


Server runs on:

http://localhost:3001

2) Frontend (Vite, usually PORT 5173)
cd client
npm install
npm run dev


Client runs on:

http://localhost:5173

CORS

Because the client and server run on different ports (5173 ↔ 3001), the backend enables CORS for the Vite dev origin:

http://localhost:5173

API
Send a message

POST /messages/send

Headers:

Content-Type: application/json

Idempotency-Key: <uuid> (recommended)

Body:

{
  "to": "+972501234567",
  "content": "Hello!"
}


Response (example):

{
  "id": "uuid",
  "to": "+972501234567",
  "content": "Hello!",
  "status": "pending",
  "createdAt": "2025-12-27T10:00:00.000Z"
}

List messages

GET /messages

Returns:

[
  { "id": "...", "to": "...", "content": "...", "status": "...", "createdAt": "..." }
]

Reliability & Idempotency Notes

Retries: when the fake provider fails, the server retries sending the same message (up to N attempts).

Idempotency: if the same request is resent with the same Idempotency-Key, the server returns the previously created message and does not create a duplicate.

What I Would Improve With More Time

Add better validation (client + server) and error messages

Add automatic refresh (polling) or webhook simulation

Add proper structured logging (levels, correlation ids)

Add tests (unit tests for provider/service + integration tests for routes)

Add a small persistence layer (or swap storage implementation behind an interface)

Improve UI UX (loading states, filtering by status, time formatting)
