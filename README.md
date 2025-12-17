Project: Stationery Management System — SRS (3‑Module, Template)
1. Purpose

Objective: Define functional and non‑functional requirements for the Stationery Management System covering: User Authentication, Item Management, Category Management.
Audience: Developers, testers, stakeholders.
2. Scope

Web application with admin and buyer roles. Admins manage items & categories. Buyers browse items. Backend API (Flask) and React frontend.
3. Definitions & Abbreviations

Admin: user role allowed to manage items/categories.
Buyer: user role allowed to browse items.
DND: drag‑and‑drop.
API: REST endpoints under /api/*.
4. References (key files)

Backend main: app.py
Frontend app: App.jsx
Auth UI: Login.jsx
Register UI: Register.jsx
API client: apiClient.js
Buyer view: BuyerItems.jsx
5. Overall Description

Users: Admin (full management), Buyer (browse only).
Architecture: React frontend communicates with Flask REST API. SQL database (Postgres or SQLite).
Persistence: Items, Categories, Users stored in DB. Frontend persists auth state in localStorage (session persistence across refresh).
6. Functional Requirements (trace & status)

FR1 — Login:

Description: Log in with username/password.
Implemented — Backend endpoint: /api/login (app.py). Frontend: Login.jsx.
Notes: Returns user role on successful login.
FR2 — Credential validation:

Description: Validate credentials before access.
Implemented — Backend validates against User table ([app.py]). Plaintext comparison (see security notes).
FR3 — Logout:

Description: Secure logout at any time.
Implemented — Frontend Navigation.jsx triggers logout; App.jsx clears state and localStorage.
FR4 — Session timeout & invalid attempt protection:

Session timeout: Implemented (client‑side, 15 minutes) in App.jsx.
Invalid‑attempt protection (server rate‑limit/lockout): NOT implemented server‑side. Recommendation: add rate limiting / attempt counters.
FR6 — Add items (mandatory fields):

Implemented — ItemManager.jsx validates required fields; backend generates unique id in POST /api/items ([app.py]).
FR7 — Validate mandatory fields:

Implemented — Frontend and backend validate fields before save.
FR8 — Edit/Delete items:

Implemented — Frontend supports edit/delete; backend supports PUT/DELETE /api/items/<id>.
FR9 — Dynamic input fields:

Partially implemented — Backend supports flexible dynamic_attributes (JSONB) in Item model ([app.py]). Frontend includes a sample dynamic field (serialNumber), but there is no UI to define arbitrary new fields at runtime. Recommendation: add admin UI to define custom attributes.
FR10 — Data consistency on update/delete:

Implemented — SQLAlchemy transactions and frontend state updates maintain consistency.
FR11 — Group items under categories:

Implemented — Category model and grouping in CategoryManager.jsx.
FR12 — Drag‑and‑drop functionality:

Implemented — DnD via @hello-pangea/dnd in CategoryManager.jsx and CategoryDraggableList.jsx; App.jsx onDragEnd updates category association and persists with itemsAPI.update.
FR13 — Auto update associations on DnD/delete:

Implemented — onDragEnd updates categoryId; deleting a category sets items' category_id to NULL server‑side ([app.py]).
FR14 — Create/rename/delete categories:

Create & delete: Implemented (POST /api/categories, DELETE /api/categories/<id> and UI).
Rename: NOT implemented — recommendation: add PUT /api/categories/<id> and rename UI.
7. External Interface Requirements (APIs)

POST /api/login — authenticate (returns user info & role) [app.py].
POST /api/register — create user with role (admin|buyer) [app.py]. Server prevents more than one admin.
GET /api/admin-exists — check whether an admin account already exists [app.py].
GET /api/items, POST /api/items, PUT /api/items/<id>, DELETE /api/items/<id> [app.py].
GET /api/categories, POST /api/categories, DELETE /api/categories/<id> [app.py].
8. Non‑Functional Requirements

Security: Currently demo-level; passwords stored/compared in plaintext. Strongly recommended: implement password hashing (werkzeug.security.generate_password_hash / check_password_hash), TLS for transport, and server-side login attempt throttling.
Availability: Backend runs on port 5000 (dev). Frontend uses Vite (dev).
Performance: Small dataset expectation; use DB indexes as needed.
Usability: Responsive UI; separate admin and buyer flows (navigation varies by role).
9. Data Requirements

Item: id (unique), name, department, issuedDate (ISO), categoryId (nullable), dynamic_attributes (JSONB).
Category: id, name.
User: id, username (unique), password, role (admin|buyer). See app.py model.
10. Constraints & Assumptions

Assumes single admin only (enforced).
DB migrations are not yet integrated (Flask‑Migrate recommended). If using an existing DB, an ALTER TABLE or migration must be applied to add role.
Demo authentication (plaintext) — not production safe.
11. System Features / Use Cases (brief)

Admin logins → manage items & categories (create/edit/delete), drag items across categories.
Buyer registers/logins → browse items displayed as cards (/browse).
New user registration via /register (frontend Register.jsx and server POST /api/register). Admin option hidden if admin already exists (GET /api/admin-exists).
12. Finally added (Extra Functionality)
These items were added beyond the original FR list and are part of the delivered project:

Role‑based registration and enforcement (admin|buyer) — backend /api/register, /api/admin-exists, frontend Register.jsx.
Single‑admin policy: server blocks creating a second admin.
Buyer browse view (/browse) with item cards — BuyerItems.jsx.
Frontend auth persistence across refresh via localStorage (App.jsx).
Conditional navigation based on role (Navigation.jsx).
Admin‑existence check to hide the admin option in registration UI.
13. Outstanding / Recommended Work

Implement secure password hashing and authentication flow.
Add server‑side rate limiting / account lockout to meet full FR4.
Add category rename endpoint/UI to fully satisfy FR14.
Add an admin UI to define dynamic item fields at runtime (complete FR9).
Integrate Flask‑Migrate (Alembic) for schema changes and produce a migration that adds role column for existing DBs.
14. Appendix — Quick commands

Recreate local SQLite DB (dev):
Add role column (Postgres):
If you want, I can now:

Implement password hashing (backend + update register/login flows), or
Add Flask‑Migrate and generate a migration to add role, or
Add category rename API/UI, or
Produce a one‑page user manual for the UI flows.
Which should I do next?




INSERT INTO public."user" (username, password)
VALUES ('admin', 'admin');