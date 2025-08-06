# 🚨 AURA Panic API – Assessment Submission

This project is a **simulated backend Panic API service** built using **Node.js, TypeScript, and in-memory infrastructure**, as part of the **AURA Senior Software Engineer Technical Assessment**. It showcases architectural decisions, fault tolerance patterns, and eventual consistency strategies aligned with AURA’s mission: **“Never miss a panic.”**

---

## 🔧 Tech Stack

| Layer         | Technology              |
|--------------|--------------------------|
| Runtime       | Node.js (TypeScript)     |
| Web Framework | Express                  |
| In-Memory DB  | JavaScript `Map`         |
| Caching Layer | Simulated Redis (TTL)    |
| Queueing      | Simulated SQS-like queue |
| Logging       | Pino + pino-pretty       |
| Testing       | Jest + ts-jest           |
| Dev Tools     | ts-node-dev              |

---

## 📦 Installation

```bash
# Clone the repo
git clone https://github.com/your-user/aura-panic-api.git
cd aura-panic-api

# Install dependencies
npm install
```

---

## 🚀 Running the API

### Development mode (with hot reload):
```bash
npm run dev
```

### Production build:
```bash
npm run build
npm start
```

> The server will start on `http://localhost:3000` by default (configured via `.env`).

---

## 🧪 Running Tests

```bash
npm run test
```

Unit tests for panic creation and retrieval live under `tests/`.

---

## 🔁 API Endpoints

### `POST /panic`

Creates a new panic record with placeholder data and queues it for asynchronous processing.

- **Request Body:**
```json
{
  "location": { "lat": -33.9, "lng": 18.4 },
  "metadata": { "triggerSource": "mobile-app" }
}
```

- **Response:**
```json
{
  "id": "uuid",
  "timestamp": 1690000000000,
  "status": "processing",
  "location": { "lat": -33.9, "lng": 18.4 },
  "metadata": {}
}
```

---

### `GET /panic/:id`

Fetches a panic record by ID. May return a placeholder if async processing is not yet complete.

- **Example Response (placeholder):**
```json
{
  "id": "uuid",
  "status": "processing",
  "timestamp": 1690000000000,
  "location": { "lat": 0, "lng": 0 }
}
```

- **Example Response (processed):**
```json
{
  "id": "uuid",
  "status": "active",
  "timestamp": 1690000000000,
  "location": { "lat": 0, "lng": 0 },
  "metadata": {
    "responder": "unit-42",
    "dispatchedAt": 1690000022222
  }
}
```

---

## 🧠 Architecture Principles Demonstrated

This lightweight implementation mirrors the proposed production architecture described in the accompanying system design document:

| Concept                     | Implementation Example                                |
|----------------------------|--------------------------------------------------------|
| **Eventual Consistency**   | Placeholder panic written to cache + DB, async updates |
| **Fault Tolerance**        | Decoupled queue with worker retry simulation           |
| **Scalability**            | Stateless service layers, simulated queue consumers    |
| **Observability**          | Structured logs using `pino`, response status tracking |
| **Modularity**             | Service-layer separation with testable logic           |
| **Resilience**             | Simulated TTL cache + fallback to persistent store     |

---

## 📁 Project Structure

```
src/
├── api/                # Express routes
├── models/             # Type definitions
├── services/           # Business logic, worker, queue
├── store/              # In-memory DB and cache
├── utils/              # Logging
├── index.ts            # App entrypoint
tests/                  # Unit tests
```

---

## 💡 Future Extensions

This codebase was intentionally designed to simulate real-world infrastructure. To extend toward full production readiness:

- Swap in real infrastructure (PostgreSQL, Redis, SQS)
- Add authentication layer
- Integrate Prometheus/Grafana metrics
- Add real async job handlers (e.g., with BullMQ or AWS SDK)
- Extend worker with responder matching logic
- Add lifecycle hooks and retries

---

## 🧾 Author Notes

- This submission aligns with the requirements of the **Engineering @ AURA – API Assessment**.
- All architectural decisions mirror those described in the **High-Level System Design Document** (see `docs/`).
- The solution reflects AURA’s technical values: resilience, scalability, and impact-driven engineering.
