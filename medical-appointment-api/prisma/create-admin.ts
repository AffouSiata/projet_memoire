import { PrismaClient, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function createAdmin() {
  console.log('👤 Création du compte administrateur...');

  try {
    // Vérifier si l'admin existe déjà
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@medical.com' },
    });

    if (existingAdmin) {
      console.log('✅ Le compte admin existe déjà !');
      console.log('   Email: admin@medical.com');
      console.log('   Mot de passe: password123\n');
      return;
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash('password123', 10);

    // Créer l'admin
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

    console.log('✅ Compte administrateur créé avec succès !');
    console.log('   Email: admin@medical.com');
    console.log('   Mot de passe: password123');
    console.log('   ID:', admin.id);
    console.log('\n💡 Vous pouvez maintenant vous connecter avec ce compte.\n');
  } catch (error) {
    console.error('❌ Erreur lors de la création:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin();
