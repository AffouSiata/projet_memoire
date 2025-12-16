const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkMedecins() {
  console.log('\n🏥 Vérification des médecins dans la base de données...\n');

  const allMedecins = await prisma.user.findMany({
    where: { role: 'MEDECIN' },
    select: {
      id: true,
      nom: true,
      prenom: true,
      email: true,
      specialite: true,
      statutValidation: true,
      isActive: true,
    },
  });

  console.log(`📊 Nombre total de médecins: ${allMedecins.length}\n`);

  if (allMedecins.length === 0) {
    console.log('❌ Aucun médecin trouvé dans la base de données!\n');
  } else {
    allMedecins.forEach((medecin, index) => {
      console.log(`${index + 1}. Dr. ${medecin.prenom} ${medecin.nom}`);
      console.log(`   Email: ${medecin.email}`);
      console.log(`   Spécialité: ${medecin.specialite || 'Non définie'}`);
      console.log(`   Statut validation: ${medecin.statutValidation || 'Non défini'}`);
      console.log(`   Actif: ${medecin.isActive ? '✅ OUI' : '❌ NON'}`);
      console.log('');
    });

    const approved = allMedecins.filter(m => m.statutValidation === 'APPROVED');
    const active = allMedecins.filter(m => m.isActive);
    const approvedAndActive = allMedecins.filter(m => m.statutValidation === 'APPROVED' && m.isActive);

    console.log('📈 Statistiques:');
    console.log(`   - Médecins approuvés: ${approved.length}/${allMedecins.length}`);
    console.log(`   - Médecins actifs: ${active.length}/${allMedecins.length}`);
    console.log(`   - Médecins visibles pour patients (approuvés ET actifs): ${approvedAndActive.length}/${allMedecins.length}`);
    console.log('');
  }

  await prisma.$disconnect();
}

checkMedecins().catch(console.error);
