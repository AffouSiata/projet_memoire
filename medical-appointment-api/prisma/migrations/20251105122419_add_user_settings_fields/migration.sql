-- AlterTable
ALTER TABLE "User" ADD COLUMN     "biometricAuth" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "langue" TEXT NOT NULL DEFAULT 'fr',
ADD COLUMN     "preferencesPromotions" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "preferencesRappels" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "twoFactorAuth" BOOLEAN NOT NULL DEFAULT false;
