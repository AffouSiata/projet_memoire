const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addFutureAppointments() {
  try {
    console.log('🚀 Ajout de rendez-vous futurs...\n');

    // Récupérer des patients et médecins existants
    const patients = await prisma.user.findMany({
      where: { role: 'PATIENT' },
      take: 3
    });

    const medecins = await prisma.user.findMany({
      where: { role: 'MEDECIN' },
      take: 3
    });

    if (patients.length === 0 || medecins.length === 0) {
      console.log('❌ Pas de patients ou médecins trouvés. Exécutez d\'abord: npx prisma db seed');
      return;
    }

    const now = new Date();

    // Fonction pour créer une date avec une heure spécifique
    const createDateWithTime = (daysFromNow, hour, minute = 0) => {
      const date = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
      date.setHours(hour, minute, 0, 0);
      return date;
    };

    // Créer des rendez-vous futurs avec des heures spécifiques
    const appointments = [
      {
        patientId: patients[0].id,
        medecinId: medecins[0].id,
        date: createDateWithTime(1, 9, 0), // Demain à 09:00
        statut: 'CONFIRME',
        motif: 'Consultation de suivi cardiologique'
      },
      {
        patientId: patients[1].id,
        medecinId: medecins[1].id,
        date: createDateWithTime(2, 10, 30), // Dans 2 jours à 10:30
        statut: 'CONFIRME',
        motif: 'Consultation pédiatrique - Vaccination'
      },
      {
        patientId: patients[2].id,
        medecinId: medecins[2].id,
        date: createDateWithTime(3, 14, 0), // Dans 3 jours à 14:00
        statut: 'EN_ATTENTE',
        motif: 'Consultation dermatologique'
      },
      {
        patientId: patients[0].id,
        medecinId: medecins[1].id,
        date: createDateWithTime(5, 11, 0), // Dans 5 jours à 11:00
        statut: 'CONFIRME',
        motif: 'Bilan de santé général'
      },
      {
        patientId: patients[1].id,
        medecinId: medecins[0].id,
        date: createDateWithTime(7, 15, 30), // Dans 7 jours à 15:30
        statut: 'EN_ATTENTE',
        motif: 'Contrôle cardiaque'
      },
      {
        patientId: patients[2].id,
        medecinId: medecins[1].id,
        date: createDateWithTime(10, 9, 30), // Dans 10 jours à 09:30
        statut: 'CONFIRME',
        motif: 'Suivi pédiatrique'
      },
      {
        patientId: patients[0].id,
        medecinId: medecins[2].id,
        date: createDateWithTime(14, 16, 0), // Dans 14 jours à 16:00
        statut: 'CONFIRME',
        motif: 'Consultation dermatologie - Suivi traitement'
      }
    ];

    // Créer les rendez-vous
    for (const appointment of appointments) {
      await prisma.rendezVous.create({
        data: appointment
      });
      console.log(`✅ Rendez-vous créé: ${appointment.date.toLocaleDateString()} - ${appointment.statut}`);
    }

    console.log(`\n🎉 ${appointments.length} rendez-vous futurs ajoutés avec succès !`);
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

addFutureAppointments();
