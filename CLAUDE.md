# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Medical Appointment Management System** with separate backend (NestJS API) and frontend (React) applications for managing appointments between patients and doctors, with admin oversight.

### Monorepo Structure
- `medical-appointment-api/` - NestJS backend API
- `medical-appointment-frontend/` - React frontend application
- `Fichiers/` - Project documentation and resources

## Initial Setup

When setting up the project for the first time:

### Backend Setup
```bash
cd medical-appointment-api

# 1. Install dependencies
npm install

# 2. Create .env file from example
cp .env.example .env
# Then edit .env with your database credentials and secrets

# 3. Create PostgreSQL database
# Make sure PostgreSQL is running, then create the database:
# createdb medical_appointment_db
# Or use pgAdmin/another tool

# 4. Run Prisma migrations
npx prisma migrate dev --name init
npx prisma generate

# 5. Seed the database with test data
npx prisma db seed

# 6. Start the server
npm run start:dev
```

### Frontend Setup
```bash
cd medical-appointment-frontend

# 1. Install dependencies
npm install

# 2. Start the dev server (make sure backend is running on 3002!)
npm start
```

## Development Commands

### Backend (API) - Port 3002
```bash
cd medical-appointment-api

# Install dependencies
npm install

# Database setup (first time)
npx prisma migrate dev --name init
npx prisma generate

# Development
npm run start:dev          # Start with hot reload
npm run build              # Build for production
npm run start:prod         # Run production build

# Testing
npm run test               # Unit tests
npm run test:watch         # Unit tests in watch mode
npm run test -- <pattern>  # Run specific test file (e.g., npm run test -- auth.service)
npm run test:e2e           # End-to-end tests
npm run test:cov           # Test coverage
npm run test:debug         # Debug tests with inspector

# Database management
npx prisma migrate dev     # Create and apply migration
npx prisma generate        # Regenerate Prisma client
npx prisma db seed         # Seed database with test data
npx prisma studio          # Open Prisma Studio GUI

# Code quality
npm run lint               # Lint and auto-fix
npm run format             # Format with Prettier
```

### Frontend - Port 3000
```bash
cd medical-appointment-frontend

# Install dependencies
npm install

# Development
npm start                  # Start dev server (localhost:3000)
npm run dev                # Alias for npm start
npm run build              # Build for production
npm test                   # Run tests
npm run eject              # Eject from create-react-app (irreversible)
```

## Architecture Overview

### Backend Architecture (NestJS)

**Three-Tier Role-Based System:**
1. **PATIENT** - Book appointments, view medical history, manage notifications
2. **MEDECIN** (Doctor) - Manage appointments, patients, medical notes, availability slots
3. **ADMIN** - Oversee all users, appointments, and system statistics

**Key Architectural Patterns:**
- **Single User Model**: All users (patients, doctors, admins) stored in one `User` table with role-based differentiation via the `role` enum field
- **JWT Authentication**: Access tokens (15min) + Refresh tokens (7d) pattern
- **Role-Based Access Control (RBAC)**: Guards and decorators enforce role restrictions at the controller level
- **Module-Per-Role**: Separate modules (`patients/`, `medecins/`, `admin/`) expose role-specific endpoints

**Core Modules:**
- `auth/` - Registration, login, JWT token management, refresh token logic
- `patients/` - Patient profile, appointment booking, notifications, preferences
- `medecins/` - Doctor profile, appointment management, medical notes, time slots
- `admin/` - User management (patients/doctors), statistics, system oversight
- `timeslots/` - Public endpoint for viewing doctor availability
- `notifications/` - Email (Nodemailer) and SMS (Twilio) notification service
- `common/` - Shared guards, decorators, filters, pipes
- `prisma/` - Database service wrapper

**Global Configuration (main.ts):**
- **CORS**: Enabled for all origins (configure for production)
- **Global Prefix**: All routes prefixed with `/api`
- **Validation Pipe**: Auto-validates DTOs, strips unknown properties (`whitelist: true`), rejects non-whitelisted props
- **Exception Filter**: Centralized error handling via `AllExceptionsFilter`
- **Logging Interceptor**: Logs all incoming requests and responses

**Authentication & Authorization Flow:**
1. User registers/logs in via `/api/auth/register` or `/api/auth/login`
2. Backend returns `accessToken` + `refreshToken` + user object
3. Frontend stores tokens in localStorage, adds `Authorization: Bearer <token>` header
4. `JwtAuthGuard` validates token on protected routes
5. `RolesGuard` checks user role matches required roles via `@Roles()` decorator
6. `@CurrentUser()` decorator injects authenticated user into controllers

**Database Design (Prisma + PostgreSQL):**
- Single `User` model with role-based fields (some fields only relevant for specific roles)
- `RendezVous` links patients and doctors with status tracking (CONFIRME, EN_ATTENTE, ANNULE)
- `NoteMedicale` stores doctor notes with file attachments for patients
- `TimeSlot` defines doctor availability by day of week and time ranges
- `Notification` tracks user notifications with read status

**Important Enums (schema.prisma):**
- `Role`: PATIENT | MEDECIN | ADMIN
- `StatutRendezVous`: CONFIRME | EN_ATTENTE | ANNULE
- `TypeNotification`: RAPPEL | CONFIRMATION | ANNULATION | CHANGEMENT_HORAIRE | RECOMMANDATION
- `StatutNote`: ACTIF | ARCHIVE
- `Theme`: CLAIR | SOMBRE
- `JourSemaine`: LUNDI | MARDI | MERCREDI | JEUDI | VENDREDI | SAMEDI | DIMANCHE
- `StatutValidation`: PENDING | APPROVED | REJECTED (for doctor validation status)

### Frontend Architecture (React)

**Key Features:**
- **React Router v6**: Role-based routing with protected routes
- **AuthContext**: Global authentication state management via Context API
- **ThemeContext**: Theme management for light/dark mode switching
- **Axios Interceptors**: Auto-inject JWT tokens, handle token refresh on 401 errors
- **Role-Specific Dashboards**: Separate UI for Patient, Doctor (Medecin), Admin roles
- **Tailwind CSS**: Utility-first styling with dark mode support
- **Headless UI**: Accessible component library for dialogs, menus, tabs
- **i18next**: Internationalization with support for French (fr, default) and English (en). Arabic (ar) translations exist but need to be enabled in config
- **Recharts**: Data visualization library for charts and statistics

**Folder Structure:**
- `src/components/` - Reusable UI components
  - `components/common/` - Shared components (Button, Input, Card, Loading)
  - `components/layout/` - Layout components (PatientLayout, MedecinLayout, AdminLayout)
  - `components/modals/` - Modal components (ConfirmModal, AlertModal)
- `src/pages/` - Page components for each route
  - `pages/auth/` - Authentication pages (Login)
  - `pages/patient/` - Patient-specific pages
  - `pages/medecin/` - Doctor-specific pages
  - `pages/admin/` - Admin-specific pages
- `src/context/` - React Context providers (AuthContext, ThemeContext)
- `src/services/` - API service layer (authService, patientService, medecinService, adminService, api config)
- `src/routes/` - Route definitions and protected route components
- `src/hooks/` - Custom React hooks (e.g., useDateFormatter)
- `src/utils/` - Utility functions (e.g., dateFormatter)
- `src/i18n/` - i18next configuration
- `src/locales/` - Translation files (ar, en, fr)

**API Integration:**
- Base URL: `http://localhost:3002/api` (configured in `services/api.js`)
- Automatic token refresh on 401 responses
- Redirects to `/login` if refresh fails

## Important Configuration

### Environment Variables (.env in API)
The backend requires these environment variables (see `.env.example` for reference):
- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` / `JWT_REFRESH_SECRET` - JWT signing secrets (MUST be changed in production)
- `EMAIL_*` - Nodemailer SMTP configuration for email notifications
- `TWILIO_*` - Twilio credentials for SMS notifications
- `PORT` - API port (default: 3000, but typically run on 3002 to avoid conflict with frontend)
- `UPLOAD_DIR` - Directory for file uploads (medical note attachments)

### Test Accounts (from seed.ts)
All accounts use password: `password123`

**Admin:**
- admin@medical.com

**Médecins (Doctors):**
- jean.kouadio@medical.com (Cardiologie)
- sophie.kone@medical.com (Pédiatrie)
- michel.traore@medical.com (Dermatologie)

**Patients:**
- marie.yao@example.com
- kouassi.bamba@example.com
- fatou.diallo@example.com

Run `npx prisma db seed` to populate the database with these test accounts.

## Key Implementation Details

### Appointment Workflow & Status Management
**IMPORTANT**: The appointment confirmation workflow follows strict role-based rules:

1. **Patient creates appointment** → Status: `EN_ATTENTE` (Pending)
   - Patient selects doctor, date, and time
   - Appointment is created via `POST /api/patients/rendezvous`

2. **Doctor confirms appointment** → Status: `CONFIRME` (Confirmed)
   - Only doctors can change status from `EN_ATTENTE` to `CONFIRME`
   - Done via doctor's appointment management interface

3. **Cancellation** → Status: `ANNULE` (Cancelled)
   - **Patients can ONLY cancel** their appointments (not confirm them)
   - **Doctors can cancel** appointments
   - Backend enforces this via `patients.service.ts:updateRendezVousStatus()`

**Security Note**: Patients attempting to confirm their own appointments (changing status to `CONFIRME`) will receive a `BadRequestException` with message: "Les patients ne peuvent qu'annuler leurs rendez-vous. Seul le médecin peut confirmer un rendez-vous."

### Role-Based Access Control
Use the `@Roles()` decorator in combination with guards:
```typescript
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.MEDECIN)
@Get('patients')
async getMyPatients(@CurrentUser() user) { ... }
```

### Database Relationships
- All relationships cascade on delete to maintain referential integrity
- Use `@index` annotations for frequently queried fields (email, role, dates, statuses)
- TimeSlots have unique constraint on `[medecinId, jour, heureDebut]` to prevent double-booking

### Notification System
The notification module automatically sends emails/SMS based on user preferences:
- Appointment confirmations, cancellations, reminders
- Respect user's `preferencesNotifEmail` and `preferencesNotifSms` flags
- Notifications stored in database AND sent via external services

### File Uploads
Medical notes support file attachments via Multer:
- Allowed types: PDF, JPEG, PNG, DOC, DOCX
- Max size: 5MB (configurable via `MAX_FILE_SIZE` env var)
- Stored in `uploads/` directory
- File paths stored as array in `NoteMedicale.piecesJointes`

### Frontend Token Management
The axios interceptor in `services/api.js` handles token refresh automatically:
- On 401 error, attempts refresh with `refreshToken`
- Updates `accessToken` in localStorage and retries original request
- If refresh fails, clears tokens and redirects to login

## Common Workflows

### Adding a New API Endpoint
1. Add method to relevant service (e.g., `patients.service.ts`)
2. Add controller method with guards and decorators
3. Update DTO files for request validation
4. Test endpoint manually or add e2e test

### Adding a New Database Field
1. Update `prisma/schema.prisma` with new field
2. Run `npx prisma migrate dev --name <description>`
3. Update DTOs and services that use the model
4. Update frontend types/interfaces if needed

### Creating a New Frontend Page
1. Create page component in `src/pages/<role>/`
2. Add route in `src/routes/` (or App.js/App.jsx)
3. Create API service method in `src/services/`
4. Add navigation link in relevant dashboard/layout
5. Add translations to `src/locales/{fr,en,ar}/translation.json` if needed

### Adding Translations
The app uses i18next for multi-language support. To add new translations:
1. Add keys to `src/locales/fr/translation.json` (primary language)
2. Add corresponding translations to `en/` and `ar/` locales
3. Use in components with `useTranslation()` hook: `const { t } = useTranslation()`
4. Access with `t('key.path')` syntax

**Language Persistence:**
- User language preference is stored in the database (`User.langue` field)
- Frontend syncs language from database on login via `AuthContext` (see `AuthContext.jsx`)
- Language changes are saved to both localStorage and database (requires API endpoint update)
- On page load, language is loaded from localStorage first, then synced with database after authentication

**RTL Support for Arabic:**
- The app has infrastructure for RTL (right-to-left) layout for Arabic
- Language preference is stored in localStorage (`language` key) and persists across sessions
- The `<html>` element's `dir` attribute is updated via i18n config (`src/i18n/config.js`)
- Available languages: `fr` (French, default), `en` (English)
- NOTE: Arabic (`ar`) translation files exist in `src/locales/ar/` but are not currently imported in `src/i18n/config.js`. To enable Arabic:
  1. Import Arabic translations in `src/i18n/config.js`
  2. Add `ar` to the resources object
  3. Update the RTL logic to set `document.documentElement.dir = lng === 'ar' ? 'rtl' : 'ltr'`

## Common Issues & Solutions

### Port Conflicts
**Issue**: Backend won't start or frontend can't connect to API
**Solution**:
- Ensure backend is running on port 3002 (set `PORT=3002` in `.env`)
- Check if port is already in use: `lsof -i :3002`
- Kill process if needed: `kill -9 <PID>`

### Database Connection Errors
**Issue**: `Error: P1001: Can't reach database server`
**Solution**:
- Verify PostgreSQL is running: `brew services list` (macOS) or `systemctl status postgresql` (Linux)
- Check DATABASE_URL in `.env` matches your PostgreSQL credentials
- Ensure database exists: `createdb medical_appointment_db`
- Run migrations: `npx prisma migrate dev`

### Authentication Issues
**Issue**: 401 Unauthorized errors or infinite redirect loops
**Solution**:
- Clear localStorage tokens in browser DevTools
- Verify JWT secrets match between `.env` and code
- Check token expiration times (15min for access, 7d for refresh)
- Ensure backend is running and accessible

### Missing Dependencies
**Issue**: Module not found errors
**Solution**:
- Run `npm install` in both `medical-appointment-api/` and `medical-appointment-frontend/`
- Delete `node_modules/` and `package-lock.json`, then reinstall
- For Prisma issues, run `npx prisma generate`

## Debugging Tips

### Backend Debugging
- Check Prisma logs: Add `log: ['query', 'error', 'warn']` to PrismaService
- Verify JWT token: Decode at jwt.io to inspect payload
- Database state: Use `npx prisma studio` to view data visually
- Check port conflicts: API runs on 3002 (not default 3000) to avoid frontend conflict
- View logs: Check console output from `npm run start:dev`

### Frontend Debugging
- Check localStorage tokens: Inspect Application tab in DevTools
- Network tab: Verify Authorization headers are present and API calls succeed
- Console logs: AuthContext updates, API responses, translation keys
- React DevTools: Check context values, component state
- Language/RTL issues: Check `<html dir>` attribute and localStorage `language` key

## Port Configuration
- **Frontend**: Port 3000 (default React dev server)
- **Backend**: Port 3002 (configured to avoid conflict with frontend)
  - IMPORTANT: The backend defaults to port 3000 in code, but should run on 3002
  - Set `PORT=3002` in `.env` or the frontend API calls will fail
  - Frontend is hardcoded to call `http://localhost:3002/api` (see `services/api.js`)
- **PostgreSQL**: Port 5432 (default)

Make sure both services are running simultaneously for full functionality.

## Quick Start (Both Services)

Both services must run simultaneously for the application to work properly.

```bash
# Terminal 1 - Start Backend (must be running first)
cd medical-appointment-api
npm run start:dev

# Terminal 2 - Start Frontend (after backend is running)
cd medical-appointment-frontend
npm start
```

Then open your browser to http://localhost:3000 and log in with test accounts (see "Test Accounts" section above).

## Project Structure

This is a **monorepo** with two independent applications:

```
projet_memoire/
├── medical-appointment-api/       # NestJS backend (port 3002)
│   ├── prisma/                    # Database schema & migrations
│   ├── src/                       # Source code
│   │   ├── auth/                  # Authentication module
│   │   ├── patients/              # Patient endpoints
│   │   ├── medecins/              # Doctor endpoints
│   │   ├── admin/                 # Admin endpoints
│   │   ├── notifications/         # Email/SMS notifications
│   │   ├── timeslots/             # Availability management
│   │   ├── common/                # Shared guards, filters, decorators
│   │   └── prisma/                # Prisma service
│   ├── uploads/                   # Medical note attachments
│   ├── .env                       # Environment variables (create from .env.example)
│   └── package.json
│
├── medical-appointment-frontend/  # React frontend (port 3000)
│   ├── public/                    # Static assets
│   ├── src/
│   │   ├── components/            # Reusable UI components
│   │   ├── pages/                 # Page components
│   │   ├── context/               # React Context (AuthContext)
│   │   ├── services/              # API integration layer
│   │   ├── routes/                # Route configuration
│   │   ├── i18n/                  # i18next setup
│   │   ├── locales/               # Translation files (fr/en/ar)
│   │   ├── hooks/                 # Custom hooks
│   │   └── utils/                 # Helper functions
│   └── package.json
│
├── Fichiers/                      # Project documentation
└── CLAUDE.md                      # This file
```
