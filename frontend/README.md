# Request Hub Frontend

React, Vite, TypeScript, Tailwind, and shadcn-style UI components for the Request Hub Demo backend.

The frontend is a compact internal dashboard for the existing request API. It includes summary cards, request filters, a request table, detail panel, request creation, comment creation, and status/priority updates.

## Backend Requirement

Run the backend at `http://127.0.0.1:8000` before starting the frontend:

```powershell
cd ..\backend
python manage.py runserver
```

## Commands

```powershell
npm install
npm run dev
npm run build
npm run lint
```

The Vite dev server runs at `http://127.0.0.1:5173` and proxies `/api` to `http://127.0.0.1:8000`.
