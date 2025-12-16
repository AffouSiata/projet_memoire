const { PrismaClient } = require('./medical-appointment-api/node_modules/@prisma/client');

const prisma = new PrismaClient();

async function checkTimeSlots() {
  try {
    console.log('\n=== CRÉNEAUX HORAIRES PAR MÉDECIN ===\n');

    const medecins = await prisma.user.findMany({
      where: {
        role: 'MEDECIN'
      },
      include: {
        timeslots: {
          orderBy: [
            { jour: 'asc' },
            { heureDebut: 'asc' }
          ]
        }
      }
    });

    if (medecins.length === 0) {
      console.log('Aucun médecin trouvé.');
      return;
    }

    for (const medecin of medecins) {
      console.log(`\n📋 Dr. ${medecin.prenom} ${medecin.nom}`);
      console.log(`   Email: ${medecin.email}`);
      console.log(`   Spécialité: ${medecin.specialite || 'Non spécifiée'}`);
      console.log(`   ID: ${medecin.id}`);

      if (medecin.timeslots.length === 0) {
        console.log('   ⚠️  Aucun créneau horaire défini\n');
      } else {
        console.log(`   ✅ ${medecin.timeslots.length} créneau(x) horaire(s):\n`);

        // Grouper par jour
        const jourOrder = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI', 'DIMANCHE'];
        const slotsByDay = {};

        medecin.timeslots.forEach(slot => {
          if (!slotsByDay[slot.jour]) {
            slotsByDay[slot.jour] = [];
          }
          slotsByDay[slot.jour].push(slot);
        });

        jourOrder.forEach(jour => {
          if (slotsByDay[jour]) {
            console.log(`      ${jour}:`);
            slotsByDay[jour].forEach(slot => {
              const status = slot.isAvailable ? '🟢 Actif' : '⚫ Inactif';
              console.log(`        ${status} | ${slot.heureDebut} - ${slot.heureFin} (ID: ${slot.id})`);
            });
          }
        });
        console.log('');
      }
    }

    // Résumé global
    const totalSlots = await prisma.timeSlot.count();
    const activeSlots = await prisma.timeSlot.count({ where: { isAvailable: true } });
    const inactiveSlots = await prisma.timeSlot.count({ where: { isAvailable: false } });

    console.log('\n=== RÉSUMÉ GLOBAL ===');
    console.log(`Total créneaux: ${totalSlots}`);
    console.log(`Actifs: ${activeSlots}`);
    console.log(`Inactifs: ${inactiveSlots}`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTimeSlots();
