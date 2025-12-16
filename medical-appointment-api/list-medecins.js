const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listMedecins() {
  try {
    const medecins = await prisma.medecin.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        specialite: true,
        email: true,
      },
    });

    console.log('\n=== MÉDECINS DISPONIBLES ===\n');
    medecins.forEach((medecin, index) => {
      console.log(`${index + 1}. Dr. ${medecin.prenom} ${medecin.nom}`);
      console.log(`   ID: ${medecin.id}`);
      console.log(`   Spécialité: ${medecin.specialite}`);
      console.log(`   Email: ${medecin.email}`);
      console.log('');
    });

    console.log(`\nTotal: ${medecins.length} médecin(s) trouvé(s)\n`);
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listMedecins();
