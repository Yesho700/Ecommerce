# E-commerce (Frontend + Backend)

This project is split into two folders:
- `frontend/` — React + Vite app that shows products, product detail, WhatsApp checkout, and an admin UI
- `backend/` — NestJS API with MongoDB for product CRUD, JWT admin login, and Cloudinary media uploads

## Prerequisites
- Node.js 18+ (recommended 20+)
- A MongoDB database (Atlas Free Tier or local MongoDB)
- A Cloudinary account (Free plan) for media
- A WhatsApp phone number for checkout links

## Environment Variables

Backend (set before running):
- `MONGO_URI` — MongoDB connection string
- `JWT_SECRET` — secret for signing admin JWT
- `ADMIN_USERNAME` — admin login username
- `ADMIN_PASSWORD` — admin login password (supports plaintext or a bcrypt hash)
- `CLOUDINARY_CLOUD_NAME` — Cloudinary cloud name
- `CLOUDINARY_API_KEY` — Cloudinary API key
- `CLOUDINARY_API_SECRET` — Cloudinary API secret
- `PORT` — optional, defaults to `4000`

Frontend (set before running):
- `VITE_API_URL` — e.g. `http://localhost:4000/api`
- `VITE_WHATSAPP_NUMBER` — WhatsApp number as digits only (no “+”)

## Local Setup

1) Backend
- `cd backend`
- `npm install`
- Set env variables (PowerShell example):
  - `$env:MONGO_URI="mongodb+srv://<user>:<pass>@<cluster>/ecommerce?retryWrites=true&w=majority"`
  - `$env:JWT_SECRET="dev_secret"`
  - `$env:ADMIN_USERNAME="admin"`
  - `$env:ADMIN_PASSWORD="admin123"` (or a bcrypt hash)
  - `$env:CLOUDINARY_CLOUD_NAME="<cloud_name>"`
  - `$env:CLOUDINARY_API_KEY="<key>"`
  - `$env:CLOUDINARY_API_SECRET="<secret>"`
- Copy `backend/.env.example` to `backend/.env` and fill values
- `npm run start:dev`  
  The API will be available at `http://localhost:4000/api`.

2) Frontend
- Open a new terminal
- `cd frontend`
- `npm install`
- Set env variables (PowerShell example):
  - `$env:VITE_API_URL="http://localhost:4000/api"`
  - `$env:VITE_WHATSAPP_NUMBER="1234567890"`
- Copy `frontend/.env.example` to `frontend/.env` and fill values
- `npm run dev`  
  Open `http://localhost:8080/`.

## Admin Flow
- Visit `http://localhost:8080/admin/login`
- Log in with `ADMIN_USERNAME` / `ADMIN_PASSWORD` (from backend env)
- After login, go to `http://localhost:8080/admin/products` to:
  - List products
  - Create products (with image/video uploads via Cloudinary)
  - Edit products (name, price, category, description)
  - Delete products

## Shopping Flow
- `Shop` lists products (fetched from backend); if backend is down, it falls back to sample data in `frontend/src/data/products.ts`
- `Product Detail` displays a selected product and opens a WhatsApp checkout form
- Checkout form collects user details and opens `wa.me/<VITE_WHATSAPP_NUMBER>` with a prefilled order message including product info, quantity, subtotal, shipping, total, and the product image

## API Endpoints
- `POST /api/auth/login` — admin login and JWT issuance  
  Code: `backend/src/auth/auth.controller.ts:10`
- `GET /api/products` — list products  
  Code: `backend/src/products/products.controller.ts:9`
- `GET /api/products/:id` — get product detail  
  Code: `backend/src/products/products.controller.ts:17`
- `POST /api/products` — create product (requires admin JWT)  
  Code: `backend/src/products/products.controller.ts:22`
- `PUT /api/products/:id` — update product (requires admin JWT)  
  Code: `backend/src/products/products.controller.ts:28`
- `DELETE /api/products/:id` — delete product (requires admin JWT)  
  Code: `backend/src/products/products.controller.ts:34`
- `POST /api/media/upload` — upload image/video to Cloudinary (requires admin JWT)  
  Code: `backend/src/cloudinary/cloudinary.controller.ts:16`

## Important Code References
- Frontend API client: `frontend/src/lib/api.ts:1`
- WhatsApp checkout form: `frontend/src/components/WhatsAppPurchaseForm.tsx:101`
- Admin login page: `frontend/src/pages/admin/Login.tsx:1`
- Admin products page: `frontend/src/pages/admin/Products.tsx:1`
- Shop page fetching: `frontend/src/pages/Shop.tsx:1`
- Product detail fetching: `frontend/src/pages/ProductDetail.tsx:1`
- Product schema (Mongo): `backend/src/products/product.schema.ts:1`
- JWT strategy: `backend/src/auth/jwt.strategy.ts:15`
- Products service (DB ops): `backend/src/products/products.service.ts:12`

## Deployment Notes
- Backend: deploy on Render/Railway (Free tier). Set all backend env vars. CORS is enabled in `backend/src/main.ts`.
- Frontend: deploy on Vercel/Netlify. Set `VITE_API_URL` to your deployed backend and `VITE_WHATSAPP_NUMBER` to your number.
- Cloudinary: configure credentials in backend env. Uploads return secure URLs.

## Troubleshooting
- “Uploads fail”: ensure `CLOUDINARY_*` env are set and valid
- “No products”: check `MONGO_URI` and that the backend is running
- “Admin login fails”: verify `ADMIN_USERNAME` / `ADMIN_PASSWORD` and `JWT_SECRET`
- “WhatsApp not opening”: check `VITE_WHATSAPP_NUMBER` (digits only, no plus)

## Folder Structure
- `backend/` — NestJS API
- `frontend/` — React Vite app
