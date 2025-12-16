import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyer les données existantes
  await prisma.notification.deleteMany();
  await prisma.noteMedicale.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.rendezVous.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Données existantes supprimées');

  // Hasher les mots de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1️⃣ Créer un Admin
  const admin = await prisma.user.create({
    data: {
      nom: 'Kouassi',
      prenom: 'Admin',
      email: 'admin@medical.com',
      motDePasse: hashedPassword,
      role: Role.ADMIN,
      telephone: '+2250700000001',
      isActive: true,
    },
  });
  console.log('✅ Admin créé:', admin.email);

  console.log('\n🎉 Seeding terminé avec succès !');
  console.log('\n📋 Compte admin créé:');
  console.log('\n👤 Admin:');
  console.log('   Email: admin@medical.com');
  console.log('   Mot de passe: password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
