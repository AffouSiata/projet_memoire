const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDoctors() {
  try {
    console.log('🔍 Vérification des médecins dans la base de données...\n');

    // Tous les médecins
    const allDoctors = await prisma.user.findMany({
      where: { role: 'MEDECIN' },
      select: {
        id: true,
        prenom: true,
        nom: true,
        specialite: true,
        statutValidation: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📊 Total médecins en BDD: ${allDoctors.length}\n`);

    // Médecins approuvés et actifs
    const approvedAndActive = allDoctors.filter(
      d => d.statutValidation === 'APPROVED' && d.isActive
    );

    console.log(`✅ Médecins APPROUVÉS et ACTIFS: ${approvedAndActive.length}`);
    approvedAndActive.forEach((doc, i) => {
      console.log(`   ${i + 1}. Dr. ${doc.prenom} ${doc.nom} - ${doc.specialite || 'PAS DE SPÉCIALITÉ'}`);
    });

    // Médecins en attente
    const pending = allDoctors.filter(d => d.statutValidation === 'PENDING');
    console.log(`\n⏳ Médecins EN ATTENTE: ${pending.length}`);
    pending.forEach((doc, i) => {
      console.log(`   ${i + 1}. Dr. ${doc.prenom} ${doc.nom} - ${doc.specialite || 'PAS DE SPÉCIALITÉ'}`);
    });

    // Médecins approuvés mais inactifs
    const approvedButInactive = allDoctors.filter(
      d => d.statutValidation === 'APPROVED' && !d.isActive
    );
    console.log(`\n❌ Médecins APPROUVÉS mais INACTIFS: ${approvedButInactive.length}`);
    approvedButInactive.forEach((doc, i) => {
      console.log(`   ${i + 1}. Dr. ${doc.prenom} ${doc.nom} - ${doc.specialite || 'PAS DE SPÉCIALITÉ'}`);
    });

    // Médecins sans spécialité
    const noSpecialty = allDoctors.filter(d => !d.specialite || d.specialite.trim() === '');
    if (noSpecialty.length > 0) {
      console.log(`\n⚠️  Médecins SANS SPÉCIALITÉ: ${noSpecialty.length}`);
      noSpecialty.forEach((doc, i) => {
        console.log(`   ${i + 1}. Dr. ${doc.prenom} ${doc.nom} - Statut: ${doc.statutValidation}`);
      });
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error('❌ Erreur:', error);
    await prisma.$disconnect();
  }
}

checkDoctors();
