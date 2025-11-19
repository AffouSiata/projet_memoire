-- CreateIndex
CREATE INDEX "User_statutValidation_idx" ON "User"("statutValidation");

-- CreateIndex
CREATE INDEX "User_isActive_idx" ON "User"("isActive");

-- CreateIndex
CREATE INDEX "User_specialite_idx" ON "User"("specialite");

-- CreateIndex
CREATE INDEX "User_role_statutValidation_isActive_idx" ON "User"("role", "statutValidation", "isActive");
