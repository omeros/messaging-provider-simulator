# Messaging Provider Simulator (Full-Stack Home Assignment)

A small full-stack **Messaging System** that simulates sending messages via an external provider.  
It demonstrates integration patterns such as **provider abstraction**, **async workflows**, **retries**, and **idempotent request handling** (no duplicate messages on repeated requests).

## Tech Stack
- **Client:** React + TypeScript + Vite + TailwindCSS
- **Server:** Node.js + Express
- **Storage:** In-memory (no database)

---

## Features

### Backend (Node.js / Express)
- `POST /messages/send`  
  Creates a message and triggers async sending via a provider abstraction.
- `GET /messages`  
  Returns the in-memory list of messages.

**Provider abstraction** with a **Fake Provider**:
- Random delay (simulates network latency)
- Random failures (simulates unreliable external service)

**Reliability**
- Retry failed sends (configurable attempts/delay)
- **Idempotency:** repeated requests with the same `Idempotency-Key` are processed only once (no duplicates)
- Console logging on status changes (e.g. `pending → sending → sent/failed`)

### Frontend (React)
- **Home page:** basic navigation
- **Send page:** form to send a message
- **Messages page:** list messages + status, with auto-refresh (polling).
---

## Project Structure
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
