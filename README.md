# Mess Management System

A full-stack web application that digitizes day-to-day hostel mess operations for FAST-NUCES students and reception staff. The project centralizes meal planning, attendance, billing, student onboarding, and policy communication so every stakeholder can complete their jobs from a single portal.

> 📄 Detailed requirements, user interviews, and design decisions live in the accompanying `SRS Document Mess Management System.pdf` and `Stakeholders Response.pdf`. This README distills how those requirements materialize in code.

## 🚀 Feature Highlights

### Student portal

- **Account lifecycle** – sign up, sign in, reset password, and complete academic/hostel profile information.
- **Meal visibility** – read-only weekly menu cards plus rules, FAQs, and notices pulled from the backend content tables.
- **Mess in/out tracking** – mark daily presence, see attendance history, and estimate current-month mess bills.
- **Billing transparency** – download monthly bills and review historical charges derived from attendance.
- **Feedback loop** – send structured complaints/feedback to the mess admin via `/api/feedback`.

### Receptionist / staff console

- **Dashboard snapshot** – quick counts for students, attendance trends, and actionable alerts.
- **Meal planning** – CRUD for the weekly `meals_menu` table with validation and instant feedback.
- **Policy management** – maintain mess rules and FAQs that sync to the public portal.
- **Roster management** – onboard students, assign degrees/hostels, and prune records (with cascading attendance cleanup).
- **Attendance oversight** – view hostel-wise daily status, override entries outside the restricted 10–12 AM window, and seed historical data for billing.

### Shared backend services

- Token-based session pseudo-auth for students and receptionists.
- Reusable PostgreSQL schema scripts (`setup-*.js`) for degrees, hostels, students, meals, rules, FAQs, and attendance.
- Consistent REST API returning JSON payloads that the React client consumes via `fetch`.

## 🧱 Architecture at a Glance

```
[React 19 SPA]  <--fetch-->  [Express 5 REST API]  <--SQL-->  [PostgreSQL 15]
      |                              |                              |
   CRA build                  Node.js runtime                 Managed locally
```

| Layer              | Tech stack                                                                             | Responsibilities                                                                          |
| ------------------ | -------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| Client (`client/`) | React 19, React Router v7, CSS modules                                                 | Present student + receptionist experiences, call REST endpoints, manage local form state. |
| Server (`server/`) | Node 18+, Express 5, `pg`, `cors`, `dotenv`, `bcrypt` (future), `nodemailer` (planned) | Authenticate users, expose domain APIs, enforce business rules, orchestrate DB access.    |
| Database           | PostgreSQL (see `server/database.js`)                                                  | Persists users, meals, attendance, billing, FAQs, rules, feedback.                        |

## 📁 Repository Layout

| Path                                      | Purpose                                                                                  |
| ----------------------------------------- | ---------------------------------------------------------------------------------------- |
| `client/src/pages/`                       | Route-specific screens (SignIn, Dashboard, ManageMeals, ManageStudents, MessBill, etc.). |
| `client/src/components/`                  | Shared UI (header, buttons, receptionist layout shell).                                  |
| `server/server.js`                        | All REST endpoints, middleware, and port binding (defaults to `4000`).                   |
| `server/database.js`                      | PostgreSQL connection pool configuration; update credentials per environment.            |
| `server/setup-*.js`                       | One-off scripts to create schema objects and seed lookup data.                           |
| `server/*.sql`                            | Aggregated SQL for manual execution if preferred over JS helpers.                        |
| `SRS Document Mess Management System.pdf` | Software Requirements Specification (scope, actors, flows).                              |
| `Stakeholders Response.pdf`               | Interview responses that shaped UX priorities.                                           |

## ✅ Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ running locally (or accessible connection string)
- Windows PowerShell (commands below target the provided environment)

## 🛠️ Setup & Installation

1. **Install dependencies**

   ```powershell
   cd "c:\Users\ucs\OneDrive - Higher Education Commission\SEMESTER 4\CS232\Project\Mess Management System\server"
   npm install

   cd ..\client
   npm install
   ```

2. **Configure environment**

   - Duplicate `server/dotenv.env` into a real `.env` file or create a fresh `.env` beside `server.js`.
   - Supply values such as `PGUSER`, `PGPASSWORD`, `PGHOST`, `PGPORT`, `PGDATABASE`, JWT secrets, and SMTP creds if you plan to enable email flows.
   - Alternatively, edit `server/database.js` to match your local PostgreSQL credentials (default user=`postgres`, password=`admin`, db=`login_system`).

3. **Provision the database schema**

   Run the helper scripts once your DB is reachable:

   ```powershell
   cd ..\server
   node setup-students-table.js
   node setup-content-tables.js
   node setup-attendance-table.js
   node setup-database.js
   node seed-attendance.js   # optional sample data
   ```

   These scripts are idempotent—rerunning them simply ensures tables exist and seed data is present.

4. **Start the backend**

   ```powershell
   cd ..\server
   npm run dev   # uses nodemon on port 4000
   ```

5. **Start the frontend**

   ```powershell
   cd ..\client
   npm start     # serves CRA dev build on http://localhost:3000
   ```

The React app expects the API at `http://localhost:4000`. Adjust fetch URLs or configure a proxy if you change ports.

## 🔌 API Reference (excerpt)

| Method                | Endpoint                                       | Description                                                         |
| --------------------- | ---------------------------------------------- | ------------------------------------------------------------------- |
| `POST`                | `/adduser`                                     | Register a new student (reg no, name, email, password).             |
| `POST`                | `/signin`                                      | Student login – returns a base64 token and profile completion flag. |
| `POST`                | `/receptionist/signin`                         | Receptionist login with separate credential store.                  |
| `POST`                | `/complete-profile`                            | Map reg no to degree + hostel, sets `profile_complete=true`.        |
| `GET`                 | `/menu`                                        | Public weekly menu (used by landing/menu screens).                  |
| `GET/PUT`             | `/api/meals`, `/api/meals/:day`                | Receptionist CRUD for breakfast/lunch/dinner plans.                 |
| `GET/POST/PUT/DELETE` | `/api/rules`, `/api/rules/:id`                 | Manage policy notices surfaced to students.                         |
| `GET/POST/PUT/DELETE` | `/api/faqs`, `/api/faqs/:id`                   | Maintain FAQ bank with featured flag.                               |
| `GET/POST`            | `/api/attendance/:regNo`, `/api/attendance`    | Student in/out logs with time-of-day safeguards.                    |
| `GET`                 | `/api/attendance/summary/:regNo`               | Monthly aggregates plus estimated bill.                             |
| `GET`                 | `/api/bill/:regNo`, `/api/bill/history/:regNo` | Generate payable amount for current or historic months.             |
| `GET/POST/DELETE`     | `/api/students`, `/api/students/:regNo`        | Receptionist roster management.                                     |
| `GET`                 | `/api/degrees`, `/api/hostels`                 | Lookup tables for dropdowns.                                        |
| `POST`                | `/api/feedback`                                | Persist complaints/feedback entries.                                |

> The server currently stores passwords in plain text and issues a simple base64 token. Before production usage, wire up `bcrypt` for hashing and `jsonwebtoken` for signed tokens—dependencies are already installed.

## 🖥️ Front-end Routes

| Route                                                                                           | Screen                                                | Backend touchpoints                                  |
| ----------------------------------------------------------------------------------------------- | ----------------------------------------------------- | ---------------------------------------------------- |
| `/`                                                                                             | Landing page with hero, quick links, and CTA buttons. | Public content (menu, rules, FAQs).                  |
| `/signup`, `/signin`, `/forgotpassword`                                                         | Auth flows for students.                              | `/adduser`, `/signin`.                               |
| `/complete-profile`                                                                             | Degree/hostel capture post-signup.                    | `/complete-profile`, `/api/degrees`, `/api/hostels`. |
| `/dashboard`, `/mess-inout`, `/mess-bill`, `/view-attendance`                                   | Student utilities.                                    | Attendance + billing APIs.                           |
| `/receptionist-dashboard`, `/manage-meals`, `/manage-rules`, `/manage-faqs`, `/manage-students` | Staff console                                         | Meals, content, student APIs.                        |

Receptionist screens share `components/receptionist/ReceptionistLayout.jsx` for navigation, while student experiences lean on standard page-level CSS modules.

## 🧪 Testing & Quality

- **Client** – Run `npm test` inside `client/` for the default Create React App harness (Testing Library + Jest). Add page-specific tests under `src/App.test.js` or colocate test files beside components.
- **Server** – No automated tests yet. Consider adding Vitest/Jest suites around the core service functions and supertest-based endpoint checks.
- **Linters/formatters** – CRA ships with ESLint; extend via `.eslintrc` if you add stricter rules.

## 📚 Project Artifacts

- `SRS Document Mess Management System.pdf` – End-to-end requirements, actors (Students, Receptionists, Admins), and system constraints.
- `Stakeholders Response.pdf` – Raw interview data from hostel residents and mess staff that guided UX priorities.
- `Requirement Gathering Plan.pdf` – Field study approach and assumptions.

Keep these documents updated when scope changes so the code and paperwork stay aligned.

## 🛣️ Roadmap Ideas

1. Replace base64 tokens with signed JWTs + refresh token rotation.
2. Encrypt passwords with `bcrypt` and enforce strong password policies.
3. Move database credentials into environment variables and support multiple environments (dev/stage/prod).
4. Add role-based route guards in the client (React Router loaders + context).
5. Build automated emails (nodemailer) for meal reminders and unpaid bills.
6. Containerize the stack with Docker Compose for a one-command spin-up.

## 🤝 Contributing

1. Fork and clone the repo.
2. Create a feature branch off `master` (or `profile-update` if you need parity).
3. Update/read this README plus the PDF artifacts whenever requirements shift.
4. Submit a PR with screenshots or Loom demos for UI-heavy changes.

---

Need help or have ideas from additional stakeholder interviews? File an issue or reach out to the team so we can keep improving the mess experience for everyone living on campus.
