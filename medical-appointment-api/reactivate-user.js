const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function reactivateUser() {
  const email = 'marie.yao@example.com';

  try {
    console.log(`🔍 Recherche de l'utilisateur: ${email}`);

    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
      },
    });

    if (!user) {
      console.log('❌ Utilisateur non trouvé');
      return;
    }

    console.log('📋 Utilisateur trouvé:', user);

    if (user.isActive) {
      console.log('✅ Le compte est déjà actif');
      return;
    }

    console.log('🔄 Réactivation du compte...');

    const updatedUser = await prisma.user.update({
      where: { email },
      data: { isActive: true },
      select: {
        id: true,
        email: true,
        nom: true,
        prenom: true,
        role: true,
        isActive: true,
      },
    });

    console.log('✅ Compte réactivé avec succès!');
    console.log('👤 Utilisateur:', updatedUser);
    console.log(`\n🎉 ${updatedUser.prenom} ${updatedUser.nom} peut maintenant se connecter`);

  } catch (error) {
    console.error('❌ Erreur:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

reactivateUser();
