const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testTimeSlotsAPI() {
  try {
    console.log('🧪 TEST: API des créneaux horaires\n');
    console.log('=' .repeat(70));

    // 1. Récupérer un médecin qui a des créneaux
    const medecinWithSlots = await prisma.user.findFirst({
      where: {
        role: 'MEDECIN',
        statutValidation: 'APPROVED',
        isActive: true,
        timeslots: {
          some: {}
        }
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        specialite: true
      }
    });

    if (!medecinWithSlots) {
      console.log('❌ Aucun médecin avec créneaux trouvé');
      await prisma.$disconnect();
      return;
    }

    console.log(`\n✅ Médecin trouvé: Dr. ${medecinWithSlots.prenom} ${medecinWithSlots.nom}`);
    console.log(`   Spécialité: ${medecinWithSlots.specialite}`);
    console.log(`   ID: ${medecinWithSlots.id}\n`);

    // 2. Tester l'API publique des créneaux (sans authentification)
    console.log('📡 Test 1: API publique GET /api/timeslots/:medecinId');
    console.log('=' .repeat(70));

    try {
      const response = await axios.get(`http://localhost:3002/api/timeslots/${medecinWithSlots.id}`);

      console.log(`✅ Réponse reçue: ${response.status}`);
      console.log(`📊 Nombre de créneaux retournés: ${response.data.length}\n`);

      if (response.data.length === 0) {
        console.log('❌ AUCUN créneau retourné par l\'API!');
      } else {
        console.log('Créneaux disponibles:\n');
        response.data.forEach((slot, index) => {
          console.log(`${index + 1}. ${slot.jour} : ${slot.heureDebut} → ${slot.heureFin}`);
        });
      }
    } catch (error) {
      console.log('❌ Erreur API:', error.response?.data || error.message);
    }

    // 3. Simuler un appel patient avec une date spécifique
    console.log('\n' + '=' .repeat(70));
    console.log('📡 Test 2: Simulation sélection date (ex: prochain lundi)');
    console.log('=' .repeat(70));

    // Trouver le prochain lundi
    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);

    console.log(`\nDate sélectionnée: ${nextMonday.toLocaleDateString('fr-FR')} (LUNDI)`);

    // Vérifier si ce médecin a des créneaux le lundi
    const mondaySlots = await prisma.timeSlot.findMany({
      where: {
        medecinId: medecinWithSlots.id,
        jour: 'LUNDI'
      }
    });

    console.log(`\nCréneaux du médecin pour LUNDI: ${mondaySlots.length}`);
    mondaySlots.forEach(slot => {
      console.log(`   ${slot.heureDebut} → ${slot.heureFin}`);
    });

    if (mondaySlots.length === 0) {
      console.log('\n⚠️  Ce médecin n\'a pas de créneaux le LUNDI!');
      console.log('   → Essayons un autre jour...\n');

      // Trouver le premier jour où le médecin a des créneaux
      const anySlot = await prisma.timeSlot.findFirst({
        where: { medecinId: medecinWithSlots.id }
      });

      if (anySlot) {
        console.log(`   Le médecin a des créneaux le ${anySlot.jour}`);
        console.log(`   Horaires: ${anySlot.heureDebut} → ${anySlot.heureFin}`);
      }
    }

    // 4. Afficher tous les médecins avec et sans créneaux
    console.log('\n' + '=' .repeat(70));
    console.log('📊 RÉSUMÉ: Médecins approuvés et leurs créneaux');
    console.log('=' .repeat(70) + '\n');

    const allApprovedDoctors = await prisma.user.findMany({
      where: {
        role: 'MEDECIN',
        statutValidation: 'APPROVED',
        isActive: true
      },
      select: {
        id: true,
        prenom: true,
        nom: true,
        specialite: true,
        _count: {
          select: {
            timeslots: true
          }
        }
      },
      orderBy: {
        nom: 'asc'
      }
    });

    allApprovedDoctors.forEach((doc, index) => {
      const hasSlots = doc._count.timeslots > 0;
      const emoji = hasSlots ? '✅' : '❌';
      console.log(`${index + 1}. ${emoji} Dr. ${doc.prenom} ${doc.nom} - ${doc.specialite || 'Sans spécialité'}`);
      console.log(`   Créneaux: ${doc._count.timeslots}`);

      if (!hasSlots) {
        console.log(`   ⚠️  AUCUN CRÉNEAU → Pas de rendez-vous possible!`);
      }
      console.log('');
    });

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Erreur:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testTimeSlotsAPI();
