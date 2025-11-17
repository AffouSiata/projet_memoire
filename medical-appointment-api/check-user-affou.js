const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function checkAndResetPassword() {
  try {
    console.log('🔍 Recherche de l\'utilisateur "affou"...\n');

    // Chercher les utilisateurs avec "affou" dans leur email ou nom
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { email: { contains: 'affou', mode: 'insensitive' } },
          { nom: { contains: 'affou', mode: 'insensitive' } },
          { prenom: { contains: 'affou', mode: 'insensitive' } },
        ],
      },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
        specialite: true,
      },
    });

    if (users.length === 0) {
      console.log('❌ Aucun utilisateur trouvé avec "affou"');
      return;
    }

    console.log(`✅ ${users.length} utilisateur(s) trouvé(s):\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.prenom} ${user.nom}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   👤 Rôle: ${user.role}`);
      console.log(`   🩺 Spécialité: ${user.specialite || 'N/A'}`);
      console.log(`   ✓ Actif: ${user.isActive ? 'Oui' : 'Non'}`);
      console.log('');
    });

    // Proposer de réinitialiser le mot de passe
    console.log('🔄 Réinitialisation du mot de passe à "password123" pour tous ces comptes...\n');

    const hashedPassword = await bcrypt.hash('password123', 10);

    for (const user of users) {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          motDePasse: hashedPassword,
          isActive: true // Activer le compte aussi
        },
      });
      console.log(`✅ Mot de passe réinitialisé pour: ${user.email}`);
    }

    console.log('\n🎉 Terminé!');
    console.log('\n📝 Informations de connexion:');
    users.forEach(user => {
      console.log(`   Email: ${user.email}`);
      console.log(`   Mot de passe: password123`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndResetPassword();
