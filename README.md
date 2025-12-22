# CampusNest (MERN)

- Two roles & sign-in pages: **Owner** and **Student/Job Seeker**
- Search by area, featured PGs
- PG details: WiFi, hot water, timings, rent by sharing, owner info
- Owner "Add PG" + Contact form to request listing
- Booking **without payments** (mock) → generates PDF receipt

## Windows 11 (PowerShell)

### Backend
```powershell
cd .\server
Copy-Item .env.example .env
npm install
npm run seed
npm run dev
```

### Frontend
```powershell
cd ..\client
Copy-Item .env.example .env
npm install
npm run dev
```

### Accounts after seeding
- Owners: `owner1@campusnest.in`, `owner2@campusnest.in` (password: `password123`)
- Seekers: `student1@campusnest.in`, `student2@campusnest.in` (password: `password123`)

### Flow
1. Start backend & frontend.
2. Sign in as **Owner** (or use the seeded owner) → add more PGs.
3. Sign in as **Student/Job** → search, open a PG, choose sharing, **Reserve & Get Receipt (Mock)**.
4. PDF opens from `http://localhost:5000/receipts/<bookingId>.pdf`.
