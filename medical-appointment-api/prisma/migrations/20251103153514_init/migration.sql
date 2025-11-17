-- CreateEnum
CREATE TYPE "Role" AS ENUM ('PATIENT', 'MEDECIN', 'ADMIN');

-- CreateEnum
CREATE TYPE "StatutRendezVous" AS ENUM ('CONFIRME', 'EN_ATTENTE', 'ANNULE');

-- CreateEnum
CREATE TYPE "TypeNotification" AS ENUM ('RAPPEL', 'CONFIRMATION', 'ANNULATION', 'CHANGEMENT_HORAIRE', 'RECOMMANDATION');

-- CreateEnum
CREATE TYPE "StatutNote" AS ENUM ('ACTIF', 'ARCHIVE');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('CLAIR', 'SOMBRE');

-- CreateEnum
CREATE TYPE "JourSemaine" AS ENUM ('LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "motDePasse" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "telephone" TEXT NOT NULL,
    "dateNaissance" TIMESTAMP(3),
    "adresse" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "preferencesNotifEmail" BOOLEAN NOT NULL DEFAULT true,
    "preferencesNotifSms" BOOLEAN NOT NULL DEFAULT true,
    "preferencesNotifPush" BOOLEAN NOT NULL DEFAULT true,
    "theme" "Theme" NOT NULL DEFAULT 'CLAIR',
    "couleurAccent" TEXT NOT NULL DEFAULT '#3b82f6',
    "specialite" TEXT,
    "refreshToken" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RendezVous" (
    "id" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "medecinId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "statut" "StatutRendezVous" NOT NULL DEFAULT 'EN_ATTENTE',
    "motif" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RendezVous_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "TypeNotification" NOT NULL,
    "titre" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "lue" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NoteMedicale" (
    "id" TEXT NOT NULL,
    "medecinId" TEXT NOT NULL,
    "patientId" TEXT NOT NULL,
    "contenu" TEXT NOT NULL,
    "statut" "StatutNote" NOT NULL DEFAULT 'ACTIF',
    "piecesJointes" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NoteMedicale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSlot" (
    "id" TEXT NOT NULL,
    "medecinId" TEXT NOT NULL,
    "jour" "JourSemaine" NOT NULL,
    "heureDebut" TEXT NOT NULL,
    "heureFin" TEXT NOT NULL,
    "isAvailable" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TimeSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "RendezVous_patientId_idx" ON "RendezVous"("patientId");

-- CreateIndex
CREATE INDEX "RendezVous_medecinId_idx" ON "RendezVous"("medecinId");

-- CreateIndex
CREATE INDEX "RendezVous_date_idx" ON "RendezVous"("date");

-- CreateIndex
CREATE INDEX "RendezVous_statut_idx" ON "RendezVous"("statut");

-- CreateIndex
CREATE INDEX "Notification_userId_idx" ON "Notification"("userId");

-- CreateIndex
CREATE INDEX "Notification_lue_idx" ON "Notification"("lue");

-- CreateIndex
CREATE INDEX "Notification_createdAt_idx" ON "Notification"("createdAt");

-- CreateIndex
CREATE INDEX "NoteMedicale_medecinId_idx" ON "NoteMedicale"("medecinId");

-- CreateIndex
CREATE INDEX "NoteMedicale_patientId_idx" ON "NoteMedicale"("patientId");

-- CreateIndex
CREATE INDEX "NoteMedicale_statut_idx" ON "NoteMedicale"("statut");

-- CreateIndex
CREATE INDEX "TimeSlot_medecinId_idx" ON "TimeSlot"("medecinId");

-- CreateIndex
CREATE INDEX "TimeSlot_jour_idx" ON "TimeSlot"("jour");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSlot_medecinId_jour_heureDebut_key" ON "TimeSlot"("medecinId", "jour", "heureDebut");

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RendezVous" ADD CONSTRAINT "RendezVous_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMedicale" ADD CONSTRAINT "NoteMedicale_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NoteMedicale" ADD CONSTRAINT "NoteMedicale_patientId_fkey" FOREIGN KEY ("patientId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSlot" ADD CONSTRAINT "TimeSlot_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
