# Shop Front Codex

## 1. Project Purpose and Scope
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Customer-facing e-commerce SPA with authenticated catalog browsing, cart/checkout, and role-based seller/admin back offices.
- Must guard every protected page behind login and enforce seller/admin authorization for management routes.
- Focus on smooth product discovery (filters, pagination), efficient order flows, and reliable seller/admin tooling.

## 2. Technology Stack
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- **Runtime**: React 19 + React DOM 19 (`package.json`)
- **Bundler**: Vite (ES modules, fast dev server)
- **State**: Redux Toolkit + Redux Persist + RTK Query (`src/app/store.js`)
- **Routing**: React Router v7 (`src/App.jsx`)
- **Styling**: Tailwind CSS + custom utilities (`tailwind.config.js`, `src/index.css`)
- **HTTP**: RTK Query base queries + Axios helper for imperative calls (`src/lib`)
- **Validation**: React Hook Form + Zod
- **Testing**: Vitest + Testing Library, custom setup (`vitest.setup.js`)
- **Lint/Format**: ESLint 9 with React, Hooks, Import, Tailwind plugins + Prettier (`eslint.config.js`)
- **Performance testing**: k6 (`k6/first_tps_test.js`)
- **Build target**: modern browsers, SPA served from `dist`.

## 3. Environment & Configuration
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- `.env` keys (Vite): `VITE_API_URL` (default `https://www.andypjt.site`, override in `src/config.js`).
- Redux Persist uses localStorage; clear storage on breaking state changes.
- Cookies (`access_token`, `refresh_token`) must be HTTP-only and provided by backend; handled via `js-cookie`.

## 4. Scripts (npm)
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- `npm run dev`: Vite dev server with hot reload.
- `npm run build`: production build to `dist`.
- `npm run preview`: preview production bundle.
- `npm run lint`: ESLint on `src/**/*.{js,jsx}`.
- `npm run test`: Vitest in CI mode.
- `npm run test:watch`: Vitest watch mode.

## 5. Application Architecture
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Entrypoint `src/main.jsx` wraps the app in Redux Provider + PersistGate.
- `src/App.jsx` defines routing tree: public auth routes, protected member area, seller/admin nested layouts.
- Shared UI layout (`src/ui/composite/PageLayout.jsx`) provides top bar, footer, and content outlet.
- Toast/Dialog contexts wrap router to enable global feedback components.
- Business logic sits inside pages/components; cross-cutting concerns (auth, API) live in `src/features` and `src/lib`.

## 6. State Management & Data Layer
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Redux slices (`src/features/auth`, `src/features/cart`) manage client state; keep them serializable.
- RTK Query APIs (`src/features/api/*.js`) encapsulate REST endpoints. Use generated hooks in components.
- `baseQueryWithReauth` handles access-token refresh: on 401, hits `/api/auth/refresh`, performs logout/redirect if refresh fails.
- Persisted slices: `auth`, `cart`. Avoid storing large/volatile data in persisted state.

## 7. Routing & Access Control
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- `ProtectedRoute` (`src/routes/ProtectedRoute.jsx`) checks `auth.role`; redirects unauthenticated users to `/auth/login`.
- Seller/admin areas use `requiredRole` to gate nested routes (`src/App.jsx`).
- Default route redirects to `/products/cpu`; fallback sends unknown paths to `/`.

## 8. UI & Styling Guidelines
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Prefer Tailwind utility classes directly in JSX; rely on `tailwind.config.js` extended palette (`primary`, `accent`, etc.).
- `src/index.css` defines global resets and dark-mode body classes using `@apply`.
- Composite components (tables, grids, modals) live under `src/ui/composite`.
- Core primitives (buttons, cards, dialog shells) under `src/ui/core`.
- Keep component names PascalCase, files `ComponentName.jsx`.
- Use React Hook Form for complex forms; convert values to numbers before submission (e.g., seller product form).

## 9. Authentication & Roles
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- `authSlice` stores `role`, `userId`; `normalizeRole` ensures consistent casing.
- Login success should set Redux state and rely on cookies for token storage; logout clears cookies and resets state.
- Persisted auth ensures session across reloads; be mindful of role changes requiring manual refresh.

## 10. API Contracts
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Product listing endpoints expect category/sort/page params (`productApi.list`).
- Seller APIs handle product CRUD with multipart form data (`toFormData` helper).
- Admin APIs manage categories/specs/seller approval.
- Follow tag-based cache invalidation rules defined per API slice.

## 11. Testing Strategy
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Unit/component tests use Vitest + Testing Library; configure globals via `vitest.setup.js`.
- Place UI tests near components (`*.test.jsx`); use msw or test server utilities as needed (`tests/`).
- Maintain dialog/toast tests (`src/ui/feedback/*test.jsx`) as examples.

## 12. Performance & Observability
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- `k6/first_tps_test.js` executes TPS stress test against production APIs; configure via env vars (cookie or login flow).
- Track custom metrics (`txn_latency`, `txn_success`, `txn_count`); ensure p95 < 500ms.
- Use `discardResponseBodies` to reduce memory during load tests.

## 13. Linting & Formatting Rules
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- ESLint enforced via `eslint.config.js`: React hooks rules, import order (`newlines-between: always`), Tailwind class order.
- Prettier config imported as last extension; run `npm run lint` before commits.
- Follow warnings for Tailwind class ordering; disable only with justification.

## 14. Directory Overview
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
```
src/
  app/               Redux store setup
  assets/            Static assets
  components/        High-level modals
  constants/         Shared constants (e.g., categories)
  features/          Redux slices & RTK Query APIs
  lib/               Utilities (API base query, axios, helpers)
  pages/             Route-level components (auth, product, seller, admin)
  routes/            Routing helpers
  ui/                Core/composite dialog/feedback components
k6/                  Performance test scripts
tests/               Shared test helpers
```

## 15. Contribution Guidelines
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Branch naming: `feature/*`, `fix/*`, `chore/*` (team convention).
- Always add tests for new features or bug fixes when feasible.
- After changes: `npm run lint`, `npm run test`, optionally run relevant k6 script if performance-related.
- Document new env vars and API changes in this file.
- For breaking backend changes, coordinate token/cookie format and update `baseQueryWithReauth`.

## 16. Deployment Notes
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
- Production build via `npm run build`; deploy `dist` through static hosting/CDN.
- Ensure `VITE_API_URL` points to correct backend stage.
- Verify Redux-persist storage and cookies behave in deployed environment (HTTPS, secure flags).

---
<<<<<<< HEAD
=======

>>>>>>> temp-rebased
_Last updated: 2025-02_
