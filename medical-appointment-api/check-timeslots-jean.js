const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkTimeSlots() {
  try {
    // Trouver le Dr Jean
    const jean = await prisma.user.findFirst({
      where: {
        prenom: 'Jean',
        role: 'MEDECIN'
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        specialite: true
      }
    });

    if (!jean) {
      console.log('❌ Dr Jean non trouvé');
      return;
    }

    console.log('✅ Dr Jean trouvé:');
    console.log(`   ID: ${jean.id}`);
    console.log(`   Nom: ${jean.prenom} ${jean.nom}`);
    console.log(`   Email: ${jean.email}`);
    console.log(`   Spécialité: ${jean.specialite}\n`);

    // Récupérer tous ses créneaux
    const timeSlots = await prisma.timeSlot.findMany({
      where: {
        medecinId: jean.id
      },
      orderBy: [
        { jour: 'asc' },
        { heureDebut: 'asc' }
      ]
    });

    console.log(`📅 Créneaux horaires: ${timeSlots.length} au total\n`);

    if (timeSlots.length === 0) {
      console.log('❌ Aucun créneau trouvé pour le Dr Jean!');
      return;
    }

    // Grouper par jour
    const byDay = {};
    timeSlots.forEach(slot => {
      if (!byDay[slot.jour]) {
        byDay[slot.jour] = [];
      }
      byDay[slot.jour].push(slot);
    });

    // Afficher par jour
    Object.keys(byDay).forEach(jour => {
      const slots = byDay[jour];
      const disponibles = slots.filter(s => s.isAvailable).length;
      console.log(`${jour}: ${slots.length} créneaux (${disponibles} disponibles)`);

      slots.slice(0, 3).forEach(slot => {
        console.log(`   ${slot.heureDebut} - ${slot.heureFin} [${slot.isAvailable ? 'DISPO' : 'NON DISPO'}]`);
      });
      if (slots.length > 3) {
        console.log(`   ... et ${slots.length - 3} autres créneaux`);
      }
      console.log('');
    });

    // Tester l'API
    console.log('\n🔍 Test de l\'API /timeslots/:medecinId');
    console.log(`URL: http://localhost:3002/api/timeslots/${jean.id}`);
    console.log(`ID du médecin: ${jean.id}\n`);

  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTimeSlots();
