# SentinelMesh

## 1️⃣ Project Overview

**Purpose**
SentinelMesh is a production-grade distributed uptime monitoring system built to detect downtime with high precision and low false positives. It solves the problem of unreliable monitoring by implementing a multi-stage verification process—ensuring that a single network blip doesn't wake an engineer at 3 AM.

Unlike simple cron-based scripts, SentinelMesh is designed as a distributed system that prioritizes reliability, data integrity, and alert hygiene. It provides a clean, fast dashboard for observance and a robust backend for execution.

**Problem Space**
*   **Reliability**: Monitoring systems must be more reliable than the systems they monitor.
*   **Noise**: Eliminating "flapping" and false positives via verification.
*   **Scale**: Handling high-throughput check execution horizontally.

---

## 2️⃣ Core Design Principles

*   **Backend as Source of Truth**: The frontend is strictly a view layer. All uptime calculations, incident inferences, and state transitions happen on the backend. This ensures consistency across API and UI.
*   **Idempotency by Default**: All scheduling and alerting operations are idempotent. A worker crashing halfway through a job or a scheduler restarting will not result in duplicate alerts or corrupted state.
*   **Async over Sync**: Heavy lifting (HTTP checks, notifications) is offloaded to background queues (Redis/BullMQ). The API remains responsive by never blocking on external I/O.
*   **Append-Only Check Data**: Check results are immutable facts. We never update a past check; we only append new ones. This provides an audit trail and simplifies concurrency.
*   **Separation of Concerns**: The *Scheduler* schedules, the *Worker* executes, and the *Verifier* decides. This decoupling allows us to scale ingestion (Workers) independently of decision logic (Verifier).

---

## 3️⃣ System Architecture

The system is composed of four distinct components:

1.  **API Service (Fastify)**: Handles CRUD operations for monitors, serves the dashboard data, and manages authentication. It creates "Monitor" records but does not execute checks.
2.  **Scheduler**: A lightweight, reliable clock that enqueues jobs into Redis based on each monitor's interval. It does not execute code; it only dispatches generic "Check Job" intent.
3.  **Worker Nodes**: Stateless consumers that pull jobs from Redis. They perform the actual HTTP/TCP requests to target URLs, capture the latency/status, and write raw "Check Results" to the database. They utilize the "Fetch" API for standardized networking.
4.  **Verifier / Alerting Engine**: An event-driven component that analyzes the stream of incoming "Check Results". It manages the state machine (UP -> DOWN) and triggers side effects (Alerts) only when state transitions occur.

---

## 4️⃣ Data Model & State Ownership

*   **Monitors** (Postgres): Configuration data (URL, Interval). Owned by User/API.
*   **Check Results** (Postgres/Timescale): Append-only immutable log of every execution. High volume. Written by Workers. Read by Verifier/Dashboard.
*   **Incidents** (Postgres): Represents a period of downtime. Stateful (OPEN -> RESOLVED). Owned by Verifier.
*   **Alerts** (Postgres): Idempotent side-effect log. Ensures we don't send the same email twice.

**Flow of Data**:
`Monitor Config` -> `Scheduler` -> `Worker Execution` -> `Check Result (Immutable)` -> `Verifier` -> `Incident (Mutable State)` -> `Alert`

---

## 5️⃣ Execution Flow (End-to-End)

1.  **Job Dispatch**: The Scheduler wakes up, identifies monitors due for execution, and pushes a `check_monitor` job to the Redis Queue with a unique `jobId` (MonitorID + Timestamp).
2.  **Execution**: An available Worker passes the job. It performs a network request to `example.com`.
3.  **Result Ingestion**: The Worker saves the result (e.g., Status: 200, Latency: 45ms) to the `CheckResult` table.
4.  **Verification**: The Verifier observes this new result.
    *   *If User is UP and Result is 200*: Do nothing.
    *   *If User is UP and Result is 500*: Trigger "Verification Mode" (e.g., retry from different region) or immediately create an **Incident**.
5.  **State Transition**: If downtime is confirmed, an `Incident` record is created (Status: OPEN).
6.  **Notification**: The Alerting Engine sees the new Incident and enqueues a notification job (Email/Slack).

---

## 6️⃣ Scheduling & Idempotency Strategy

*   **Jobs**: We use BullMQ (Redis) for a robust distributed priority queue.
*   **Idempotency Keys**: Every job is deduped using the `monitorId` and the `time slot`. If the scheduler restarts, it attempts to re-queue the same slot, but Redis rejects the duplicate ID.
*   **Per-Monitor Intervals**: Unlike a global loop, every monitor has its own cadence (10s, 60s, 5m). We use a "next_check_at" timestamp index to efficiently query due monitors.

---

## 7️⃣ Failure Handling & Reliability

*   **Worker Crashes**: If a worker dies mid-request, Redis relies on the "Visibility Timeout". The job will eventually time out and be picked up by another worker.
*   **Database Outage**: Workers function in "local buffer" mode or fail fast. The Queue acts as a buffer—jobs pile up in Redis until the DB recovers.
*   **False Positives**: We implement a retries logic before declaring an incident. A single timeout does not trigger a page; 2-3 consecutive failures do.

---

## 8️⃣ Alerting Semantics (Anti-Spam Logic)

*   **State-Based Alerting**: We only alert on **transitions** (UP -> DOWN, DOWN -> UP). We never alert on "Still Down". This radically reduces noise.
*   **Deduplication**: Before sending an email, we check the `Alerts` table. If an alert for `Incident #123` was sent < 5 minutes ago, we suppress the new one.
*   **Grace Period**: New monitors start in a "Pending" state to prevent alerts during initial configuration.

---

## 9️⃣ Trade-offs & Intentional Decisions

| Decision | Why we did it | Trade-off |
| :--- | :--- | :--- |
| **Polling vs Evented (Frontend)** | Simple to implement, works well with React Query. | Slightly delayed updates (up to 10s) vs real-time sockets. |
| **Postgres forTimeSeries** | Simplifies stack (one DB). Good enough for <100k monitors. | Storage cost higher than dedicated TSDB (Prometheus/ClickHouse) at massive scale. |
| **In-Memory Auth** | Extreme security, no client-side persistence tokens. | User must log in on every refresh (Acceptable for MVP/Security-first). |
| **Single Region Checks** | Simplicity. | Cannot detect regional outages or verify global availability. |

---

## 🔟 Scaling Considerations

*   **Scheduler**: Can be sharded by `Monitor ID` (Monitors 1-1000 -> Scheduler A, etc.) to handle millions of monitors.
*   **Workers**: Horizontally scalable. Just add more containers/pods consuming the Redis queue.
*   **Database**:
    *   *Read Replicas*: For dashboard queries.
    *   *Partitioning*: `CheckResults` table should be partitioned by time (e.g., monthly tables) to maintain query performance as history grows.
    *   *Archival*: Move old check results to cold storage (S3/Parquet) after 30 days.

---

## 1️⃣1️⃣ Security Considerations

*   **JWT in Memory**: We deliberately avoid `localStorage` to prevent XSS attacks from leaking tokens.
*   **Read-Only Frontend**: The frontend has zero business logic. It trustlessly renders what the backend sends.
*   **Input Validation**: Strict `zod` schemas on both Frontend forms and Backend API endpoints.
*   **No Secrets**: All API keys and connection strings are strictly environment variables, never committed.

---

## 1️⃣2️⃣ Observability & Debugging

*   **Structured Logging**: JSON logs with `monitorId` and `jobId` context allow us to trace a specific check through the entire pipeline.
*   **Correlation IDs**: Every request has a `request-id` passed from Nginx -> API -> DB.
*   **Health Checks**: `/health` endpoint exposes internal component status (Redis connection, DB lag) for k8s liveness probes.

---

## 1️⃣3️⃣ What This Project Demonstrates

*   **Distributed Systems Implementation**: Shows ability to reason about queues, workers, and concurrency.
*   **Full Stack Proficiency**: From Next.js UI polish to Node.js backend architecture.
*   **Operational Maturity**: Focus on reliability, idempotency, and "day 2" operations over feature capability.
*   **Clean Architecture**: Separation of concerns and type safety (TypeScript) across the stack.

---

## 1️⃣4️⃣ How to Run Locally

**Prerequisites**
*   Node.js 20+
*   Docker & Docker Compose (for Postgres/Redis)
*   pnpm

**Setup**
1.  **Start Infrastructure**:
    ```bash
    docker-compose up -d
    ```
2.  **Environment Variables**:
    ```bash
    cp .env.example .env
    ```
3.  **Install & Build**:
    ```bash
    pnpm install
    pnpm build
    ```
    *(This builds core packages, api, and web)*

4.  **Run Development**:
    ```bash
    pnpm dev
    ```
    *   Frontend: `http://localhost:3000`
    *   Backend: `http://localhost:3001`