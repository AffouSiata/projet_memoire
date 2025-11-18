const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkTimeSlots() {
  try {
    console.log('🕐 Vérification des créneaux horaires dans la base de données...\n');
    console.log('=' .repeat(70));

    // Récupérer tous les créneaux horaires
    const allTimeSlots = await prisma.timeSlot.findMany({
      include: {
        medecin: {
          select: {
            prenom: true,
            nom: true,
            specialite: true,
            statutValidation: true,
            isActive: true
          }
        }
      },
      orderBy: [
        { medecinId: 'asc' },
        { jour: 'asc' },
        { heureDebut: 'asc' }
      ]
    });

    console.log(`\n📊 Total créneaux horaires en BDD: ${allTimeSlots.length}\n`);

    if (allTimeSlots.length === 0) {
      console.log('❌ AUCUN créneau horaire trouvé dans la base de données!');
      console.log('   → Les médecins doivent définir leurs disponibilités dans "Créneaux Horaires"\n');
    } else {
      // Grouper par médecin
      const slotsByDoctor = {};

      allTimeSlots.forEach(slot => {
        const doctorKey = slot.medecinId;
        if (!slotsByDoctor[doctorKey]) {
          slotsByDoctor[doctorKey] = {
            doctor: slot.medecin,
            slots: []
          };
        }
        slotsByDoctor[doctorKey].slots.push(slot);
      });

      // Afficher pour chaque médecin
      Object.values(slotsByDoctor).forEach(({ doctor, slots }) => {
        const statusEmoji = doctor.statutValidation === 'APPROVED' && doctor.isActive ? '✅' : '❌';
        console.log(`${statusEmoji} Dr. ${doctor.prenom} ${doctor.nom} - ${doctor.specialite || 'Sans spécialité'}`);
        console.log(`   Statut: ${doctor.statutValidation} | Actif: ${doctor.isActive}`);
        console.log(`   Créneaux: ${slots.length}`);

        // Afficher les créneaux par jour
        const slotsByDay = {};
        slots.forEach(slot => {
          if (!slotsByDay[slot.jour]) {
            slotsByDay[slot.jour] = [];
          }
          slotsByDay[slot.jour].push(`${slot.heureDebut}-${slot.heureFin}`);
        });

        Object.entries(slotsByDay).forEach(([jour, horaires]) => {
          console.log(`   ${jour}: ${horaires.join(', ')}`);
        });
        console.log('');
      });
    }

    // Vérifier les médecins SANS créneaux
    const medecinsWithoutSlots = await prisma.user.findMany({
      where: {
        role: 'MEDECIN',
        statutValidation: 'APPROVED',
        isActive: true,
        timeSlots: {
          none: {}
        }
      },
      select: {
        prenom: true,
        nom: true,
        specialite: true
      }
    });

    if (medecinsWithoutSlots.length > 0) {
      console.log('=' .repeat(70));
      console.log('⚠️  MÉDECINS APPROUVÉS SANS CRÉNEAUX HORAIRES:\n');
      medecinsWithoutSlots.forEach((doc, index) => {
        console.log(`${index + 1}. Dr. ${doc.prenom} ${doc.nom} - ${doc.specialite || 'Sans spécialité'}`);
        console.log('   → Ce médecin n\'a défini aucun créneau horaire');
      });
      console.log('\n💡 Ces médecins ne pourront pas recevoir de rendez-vous tant qu\'ils n\'auront pas défini leurs créneaux!');
    }

    console.log('\n' + '=' .repeat(70));

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Erreur:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

checkTimeSlots();
