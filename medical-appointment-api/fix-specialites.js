const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Mapping anglais -> français
const specialtyMapping = {
  'cardiology': 'Cardiologie',
  'pediatrics': 'Pédiatrie',
  'dermatology': 'Dermatologie',
  'neurology': 'Neurologie',
  'ophthalmology': 'Ophtalmologie',
  'dentistry': 'Dentisterie',
  'gynecology': 'Gynécologie',
  'generalMedicine': 'Médecine générale',
  'psychiatry': 'Psychiatrie',
};

async function fixSpecialties() {
  console.log('\n🔧 Mise à jour des spécialités en français...\n');

  const medecins = await prisma.user.findMany({
    where: { role: 'MEDECIN' },
    select: { id: true, specialite: true, prenom: true, nom: true },
  });

  for (const medecin of medecins) {
    const frenchSpecialty = specialtyMapping[medecin.specialite];

    if (frenchSpecialty) {
      await prisma.user.update({
        where: { id: medecin.id },
        data: { specialite: frenchSpecialty },
      });
      console.log(`✅ Dr. ${medecin.prenom} ${medecin.nom}: ${medecin.specialite} → ${frenchSpecialty}`);
    } else {
      console.log(`⚠️  Dr. ${medecin.prenom} ${medecin.nom}: ${medecin.specialite} (déjà en français ou non mappé)`);
    }
  }

  console.log('\n✅ Mise à jour terminée!\n');
  await prisma.$disconnect();
}

fixSpecialties().catch(console.error);
