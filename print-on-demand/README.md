# Print-on-Demand Full-Stack Application

This implementation provides a scalable monorepo-ready structure with:
- **Frontend**: Next.js + React + TailwindCSS + Fabric.js + Zustand
- **Backend**: Node.js + Express + MongoDB
- **Storage**: Cloudflare R2 / S3-compatible object storage

## Folder Structure

```text
print-on-demand/
  frontend/
    app/
      admin/page.tsx
      checkout/page.tsx
      studio/page.tsx
      layout.tsx
      page.tsx
      globals.css
    components/
      ProductCatalog.tsx
      DesignStudio.tsx
      Checkout.tsx
      AdminOrders.tsx
    lib/api.ts
    store/useStore.ts
    types/index.ts
  backend/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
      server.js
```

## API Endpoints

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`

### Products & Catalog
- `GET /api/products?category=&designCategory=&type=`
- `POST /api/products` (admin)

### Design Studio
- `GET /api/designs/assets`
- `POST /api/designs/upload` (requires copyright disclaimer acceptance on frontend)
- `POST /api/designs/ai-generate` (usage-limited)
- `POST /api/designs/canvas/save` (usage-limited mockup generation)
- `POST /api/designs/assets/:assetId/use`

### Usage Limits
- `GET /api/usage/me`

### Checkout & Orders
- `POST /api/orders`
- `POST /api/orders/:orderId/confirm-upi`
- `GET /api/orders/me`
- `GET /api/orders/admin` (admin)
- `GET /api/orders/designs/details?designIds=id1,id2`

## Data Collections
- Users
- Products
- Orders
- Designs
- Assets
- UsageLimits

## Usage-Limit Logic
- Free tier: limited AI generations and mockup previews.
- On successful purchase confirmation: user upgrades to buyer tier and receives higher quotas.

## Design Ownership Disclaimer
Frontend requires users to accept a design ownership/copyright checkbox before upload.

## Running Locally

### Backend
1. `cd backend`
2. `npm install`
3. Configure env vars:
   - `MONGO_URI`
   - `JWT_SECRET`
   - `OPENAI_API_KEY`
   - `R2_ENDPOINT`
   - `R2_ACCESS_KEY_ID`
   - `R2_SECRET_ACCESS_KEY`
   - `R2_BUCKET`
4. `npm run dev`

### Frontend
1. `cd frontend`
2. `npm install`
3. Set `NEXT_PUBLIC_API_BASE=http://localhost:4000/api`
4. `npm run dev`
