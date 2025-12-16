const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function listPatients() {
  try {
    const patients = await prisma.patient.findMany({
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        telephone: true,
        dateNaissance: true,
      },
      take: 10,
    });

    console.log('\n=== COMPTES PATIENTS ===\n');
    patients.forEach((patient, index) => {
      console.log(`${index + 1}. ${patient.prenom} ${patient.nom}`);
      console.log(`   Email: ${patient.email}`);
      console.log(`   Téléphone: ${patient.telephone || 'N/A'}`);
      console.log(`   Date de naissance: ${patient.dateNaissance ? new Date(patient.dateNaissance).toLocaleDateString('fr-FR') : 'N/A'}`);
      console.log('');
    });

    console.log(`\nTotal: ${patients.length} patient(s) trouvé(s)\n`);
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listPatients();
