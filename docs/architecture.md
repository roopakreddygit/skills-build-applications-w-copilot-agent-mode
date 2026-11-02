# OctoFit Tracker architecture

OctoFit Tracker is a three-tier application for a school fitness program. The starter code includes API contracts and intentionally incomplete implementation points so you can use GitHub Copilot agent mode in a test-driven loop.

![Three-tier OctoFit architecture](../.github/images/octofit-architecture.svg)

## Tier boundaries

- **Presentation tier**: React 19, Vite, React Router, Bootstrap, and a shared API client in `octofit-tracker/frontend/src`.
- **Logic tier**: Express and TypeScript routes/services in `octofit-tracker/backend/src` expose `/api/*` behavior on port `8000`.
- **Data tier**: Mongoose models and seed data in `octofit-tracker/backend/src/models` and `src/scripts/seed.ts` persist to MongoDB on port `27017`.

## Ports and environment rules

- MongoDB: `27017`
- Express API: `8000`
- Vite frontend: `5173`
- The browser calls relative `/api` paths. Vite proxies them to `http://localhost:8000`, so the unauthenticated API port stays private in Codespaces. `VITE_API_BASE_URL` can override the base URL.

## API contract

| Capability | Method and path | Expected behavior |
| --- | --- | --- |
| Activity tracking | `GET /api/activities`, `POST /api/activities` | List and create valid activity records. POST accepts `userId`, `teamId`, `type`, and `minutes`; `userId` and `teamId` must be well-formed IDs for an existing user and team; otherwise respond with a deliberate 4xx (never a 500 from a cast error). A created activity stores the submitted `user`, `team`, `type`, and `minutes` plus computed `points` and `occurredAt`. |
| Teams | `GET /api/teams`, `POST /api/teams` | List and create teams with members. Created and listed teams keep the submitted `name` and `mascot`. Reject a team without a name with `400`. |
| Leaderboard | `GET /api/leaderboard` | Return teams ordered by the sum of their activity points, highest first. Each entry has `teamName`, `totalPoints`, and a 1-based `rank`. |
| Workout suggestions | `GET /api/workouts/suggestions/:userEmail` | Recommend workouts from recent activity patterns for the matching seeded user's email address. The first suggestion's `focus` matches that user's goal or recent activity, with a `reason` explaining why. An email with no matching user returns a deliberate 4xx (for example, `404`). |

## Implementation decisions

Record the implementation decisions before editing code.

- Presentation tier decision: Keep navigation and rendering in React pages; use the shared API client with relative `/api` paths and provide accessible loading, error, empty, and populated states.
- Logic tier decision: Keep HTTP handling in Express routes and validation/business rules in explicit service functions; return deliberate 4xx responses for invalid or unknown resources.
- Data tier decision: Enforce required fields and sensible constraints in Mongoose schemas, and use idempotent seed upserts without deleting unrelated records.
- Activity tracking approach: Validate request shape, ObjectId formats, and existing user/team references; persist the submitted activity fields with computed points and an occurrence timestamp.
- Team management approach: Validate team name, mascot, and member IDs; create teams with an empty members array by default and keep user/team membership references consistent.
- Leaderboard approach: Aggregate activity points by team, sort highest total first with a deterministic tie-breaker, and assign 1-based ranks.
- Workout suggestions approach: Find the user by email, use their goal and recent activity to choose matching workout focus, include a reason, and return 404 when no user matches.

## Test plan

Record the commands you run and what each failure means.

- Data-tier command: `npm run test:data --prefix octofit-tracker/backend` — passed (5/5); failures indicate model validation or seed behavior violates the data contract.
- API command: `npm run test:api --prefix octofit-tracker/backend` — passed (4/4); failures indicate endpoint validation, persistence, response shape, or business logic violates the API contract.
- Frontend command: `npm test --prefix octofit-tracker/frontend` — passed (15/15); failures indicate API integration, rendered content, or accessible loading/empty/error states violate the presentation contract.
- Backend build command: `npm run build --prefix octofit-tracker/backend` — passed; failures indicate backend TypeScript compilation errors.
- Frontend build command: `npm run build --prefix octofit-tracker/frontend` — passed; failures indicate frontend TypeScript or production-bundling errors.
