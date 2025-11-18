-- CreateTable
CREATE TABLE "MedecinIndisponibilite" (
    "id" TEXT NOT NULL,
    "medecinId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "raison" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MedecinIndisponibilite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MedecinIndisponibilite_medecinId_idx" ON "MedecinIndisponibilite"("medecinId");

-- CreateIndex
CREATE INDEX "MedecinIndisponibilite_date_idx" ON "MedecinIndisponibilite"("date");

-- CreateIndex
CREATE UNIQUE INDEX "MedecinIndisponibilite_medecinId_date_key" ON "MedecinIndisponibilite"("medecinId", "date");

-- AddForeignKey
ALTER TABLE "MedecinIndisponibilite" ADD CONSTRAINT "MedecinIndisponibilite_medecinId_fkey" FOREIGN KEY ("medecinId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
