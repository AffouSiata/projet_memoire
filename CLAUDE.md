# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a **Medical Appointment Management System** with separate backend (NestJS API) and frontend (React) applications for managing appointments between patients and doctors, with admin oversight.

### Monorepo Structure
- `medical-appointment-api/` - NestJS backend API (port 3002)
- `medical-appointment-frontend/` - React frontend application (port 3000)
- `Fichiers/` - Project documentation and resources

## Quick Start

```bash
# Terminal 1 - Backend (must start first)
cd medical-appointment-api
npm install
cp .env.example .env              # Configure with your database credentials
npx prisma migrate dev            # Run migrations
npx prisma db seed                # Seed test data
npm run start:dev                 # Starts on port 3002

# Terminal 2 - Frontend
cd medical-appointment-frontend
npm install
npm start                         # Starts on port 3000
```

Open http://localhost:3000 and log in with test accounts (see "Test Accounts" section).

## Development Commands

### Backend (medical-appointment-api)
```bash
npm run start:dev          # Start with hot reload (port 3002)
npm run build              # Build for production
npm run start:prod         # Run production build
npm run test               # Unit tests
npm run test -- <pattern>  # Run specific test (e.g., npm run test -- auth.service)
npm run test:e2e           # End-to-end tests
npm run test:cov           # Test coverage
npm run lint               # Lint and auto-fix
npm run format             # Format with Prettier

# Database
npx prisma migrate dev --name <description>  # Create migration
npx prisma generate                          # Regenerate client
npx prisma db seed                           # Seed test data
npx prisma studio                            # GUI database viewer
```

### Frontend (medical-appointment-frontend)
```bash
npm start                  # Start dev server (port 3000)
npm run build              # Build for production
npm test                   # Run tests
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

**Database Models (Prisma + PostgreSQL):**
- `User` - Single model for all users (patients, doctors, admins) with role-based fields
- `RendezVous` - Appointments linking patients and doctors with status tracking
- `NoteMedicale` - Doctor notes with file attachments for patients
- `TimeSlot` - Doctor availability by day of week and time ranges
- `Notification` - User notifications with read status
- `MedecinIndisponibilite` - Specific dates when doctors are unavailable
- `AuditLog` - System activity logging for admin oversight

**Important Enums (schema.prisma):**
- `Role`: PATIENT | MEDECIN | ADMIN
- `StatutRendezVous`: CONFIRME | EN_ATTENTE | ANNULE
- `TypeNotification`: RAPPEL | CONFIRMATION | ANNULATION | CHANGEMENT_HORAIRE | RECOMMANDATION
- `StatutNote`: ACTIF | ARCHIVE
- `Theme`: CLAIR | SOMBRE
- `JourSemaine`: LUNDI | MARDI | MERCREDI | JEUDI | VENDREDI | SAMEDI | DIMANCHE
- `StatutValidation`: PENDING | APPROVED | REJECTED (for doctor validation status)

### Frontend Architecture (React)

**Key Technologies:**
- **React 19** with React Router v6 for role-based routing
- **Tailwind CSS** with dark mode support
- **Headless UI** for accessible dialogs/menus
- **i18next** for internationalization (French default, English available)
- **Recharts** for data visualization
- **Axios** with interceptors for API calls

**Key Patterns:**
- **AuthContext** - Global auth state, auto-loads user language preference from database
- **ThemeContext** - Light/dark mode switching
- **Role-Specific Layouts** - PatientLayout, MedecinLayout, AdminLayout in `components/layout/`
- **API Service Layer** - `services/` directory with authService, patientService, medecinService, adminService
- **Token Management** - Auto-refresh on 401 errors, redirects to login on failure

**API Integration:**
- Base URL: `http://localhost:3002/api` (configured in `services/api.js`)
- Automatic Bearer token injection via axios interceptors

## API Routes Reference

| Module | Endpoint Prefix | Description |
|--------|-----------------|-------------|
| Auth | `/api/auth` | Register, login, refresh token |
| Patients | `/api/patients` | Patient profile, appointments, notifications |
| Medecins | `/api/medecins` | Doctor profile, appointments, notes, availability |
| Admin | `/api/admin` | User management, statistics, system oversight |
| TimeSlots | `/api/timeslots` | Public doctor availability |

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
Backend must run on port 3002 (set `PORT=3002` in `.env`). Frontend hardcodes `http://localhost:3002/api`.
```bash
lsof -i :3002              # Check if port in use
kill -9 <PID>              # Kill process if needed
```

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

**Backend**: Use `npx prisma studio` for database inspection, decode JWT at jwt.io, check console logs from `npm run start:dev`

**Frontend**: Check localStorage tokens (Application tab), verify Authorization headers in Network tab, use React DevTools for context/state inspection

## Deployment

The project can be deployed to **Render** (free tier available). See `DEPLOYMENT.md` for detailed instructions.

Key deployment notes:
- Uses Docker for combined API + static frontend deployment
- PostgreSQL database on Render (free tier: 1GB, 90-day expiration)
- Environment variables configured in Render dashboard
- Free tier instances sleep after 15 minutes of inactivity
