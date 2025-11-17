import { PrismaClient, Role, StatutRendezVous, TypeNotification, Theme, JourSemaine } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Nettoyer les données existantes
  await prisma.notification.deleteMany();
  await prisma.noteMedicale.deleteMany();
  await prisma.timeSlot.deleteMany();
  await prisma.rendezVous.deleteMany();
  await prisma.user.deleteMany();

  console.log('✅ Données existantes supprimées');

  // Hasher les mots de passe
  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1️⃣ Créer un Admin
  const admin = await prisma.user.create({
    data: {
      nom: 'Kouassi',
      prenom: 'Admin',
      email: 'admin@medical.com',
      motDePasse: hashedPassword,
      role: Role.ADMIN,
      telephone: '+2250700000001',
      isActive: true,
    },
  });
  console.log('✅ Admin créé:', admin.email);

  // 2️⃣ Créer des Médecins
  const medecins = await Promise.all([
    prisma.user.create({
      data: {
        nom: 'Kouadio',
        prenom: 'Jean',
        email: 'jean.kouadio@medical.com',
        motDePasse: hashedPassword,
        role: Role.MEDECIN,
        telephone: '+2250700000002',
        specialite: 'Cardiologie',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        nom: 'Koné',
        prenom: 'Sophie',
        email: 'sophie.kone@medical.com',
        motDePasse: hashedPassword,
        role: Role.MEDECIN,
        telephone: '+2250700000003',
        specialite: 'Pédiatrie',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        nom: 'Traoré',
        prenom: 'Michel',
        email: 'michel.traore@medical.com',
        motDePasse: hashedPassword,
        role: Role.MEDECIN,
        telephone: '+2250700000004',
        specialite: 'Dermatologie',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Médecins créés:', medecins.length);

  // 3️⃣ Créer des créneaux pour les médecins
  const jours: JourSemaine[] = ['LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI'];
  const heures = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];

  for (const medecin of medecins) {
    const slots: any[] = [];
    for (const jour of jours) {
      for (let i = 0; i < heures.length - 1; i++) {
        slots.push({
          medecinId: medecin.id,
          jour,
          heureDebut: heures[i],
          heureFin: heures[i + 1],
          isAvailable: true,
        });
      }
    }
    await prisma.timeSlot.createMany({ data: slots });
  }
  console.log('✅ Créneaux créés pour les médecins');

  // 4️⃣ Créer des Patients
  const patients = await Promise.all([
    prisma.user.create({
      data: {
        nom: 'Yao',
        prenom: 'Marie',
        email: 'marie.yao@example.com',
        motDePasse: hashedPassword,
        role: Role.PATIENT,
        telephone: '+2250700000010',
        dateNaissance: new Date('1990-05-15'),
        adresse: '10 Rue de la Paix, Abidjan',
        preferencesNotifEmail: true,
        preferencesNotifSms: true,
        preferencesNotifPush: true,
        theme: Theme.CLAIR,
        couleurAccent: '#3b82f6',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        nom: 'Bamba',
        prenom: 'Kouassi',
        email: 'kouassi.bamba@example.com',
        motDePasse: hashedPassword,
        role: Role.PATIENT,
        telephone: '+2250700000011',
        dateNaissance: new Date('1985-08-20'),
        adresse: '25 Avenue Charles De Gaulle, Abidjan',
        preferencesNotifEmail: true,
        preferencesNotifSms: false,
        preferencesNotifPush: true,
        theme: Theme.SOMBRE,
        couleurAccent: '#10b981',
        isActive: true,
      },
    }),
    prisma.user.create({
      data: {
        nom: 'Diallo',
        prenom: 'Fatou',
        email: 'fatou.diallo@example.com',
        motDePasse: hashedPassword,
        role: Role.PATIENT,
        telephone: '+2250700000012',
        dateNaissance: new Date('1995-12-10'),
        adresse: '5 Boulevard de la République, Abidjan',
        preferencesNotifEmail: true,
        preferencesNotifSms: true,
        preferencesNotifPush: false,
        theme: Theme.CLAIR,
        couleurAccent: '#8b5cf6',
        isActive: true,
      },
    }),
  ]);
  console.log('✅ Patients créés:', patients.length);

  // 5️⃣ Créer des Rendez-vous
  const now = new Date();
  const rendezvousList: any[] = [];

  // Rendez-vous passés
  rendezvousList.push({
    patientId: patients[0].id,
    medecinId: medecins[0].id,
    date: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // Il y a 30 jours
    statut: StatutRendezVous.CONFIRME,
    motif: 'Consultation de routine cardiologie',
  });

  rendezvousList.push({
    patientId: patients[1].id,
    medecinId: medecins[1].id,
    date: new Date(now.getTime() - 15 * 24 * 60 * 60 * 1000), // Il y a 15 jours
    statut: StatutRendezVous.CONFIRME,
    motif: 'Consultation pédiatrique',
  });

  // Rendez-vous futurs
  rendezvousList.push({
    patientId: patients[0].id,
    medecinId: medecins[0].id,
    date: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000), // Dans 2 jours
    statut: StatutRendezVous.CONFIRME,
    motif: 'Suivi cardiologique',
  });

  rendezvousList.push({
    patientId: patients[1].id,
    medecinId: medecins[2].id,
    date: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000), // Dans 5 jours
    statut: StatutRendezVous.EN_ATTENTE,
    motif: 'Consultation dermatologie - Acné',
  });

  rendezvousList.push({
    patientId: patients[2].id,
    medecinId: medecins[1].id,
    date: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000), // Dans 10 jours
    statut: StatutRendezVous.CONFIRME,
    motif: 'Vaccination enfant',
  });

  // Rendez-vous annulé
  rendezvousList.push({
    patientId: patients[2].id,
    medecinId: medecins[0].id,
    date: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000), // Il y a 5 jours
    statut: StatutRendezVous.ANNULE,
    motif: 'Consultation cardiologie',
  });

  await prisma.rendezVous.createMany({ data: rendezvousList });
  console.log('✅ Rendez-vous créés:', rendezvousList.length);

  // 6️⃣ Créer des Notifications
  const notificationsList: any[] = [];

  for (const patient of patients) {
    notificationsList.push({
      userId: patient.id,
      type: TypeNotification.CONFIRMATION,
      titre: 'Rendez-vous confirmé',
      description: 'Votre rendez-vous a été confirmé avec succès.',
      lue: false,
    });

    notificationsList.push({
      userId: patient.id,
      type: TypeNotification.RAPPEL,
      titre: 'Rappel de rendez-vous',
      description: 'N\'oubliez pas votre rendez-vous demain à 10h.',
      lue: true,
    });
  }

  for (const medecin of medecins) {
    notificationsList.push({
      userId: medecin.id,
      type: TypeNotification.CONFIRMATION,
      titre: 'Nouveau rendez-vous',
      description: 'Un nouveau rendez-vous a été ajouté à votre planning.',
      lue: false,
    });
  }

  notificationsList.push({
    userId: admin.id,
    type: TypeNotification.RECOMMANDATION,
    titre: 'Rapport mensuel',
    description: 'Le rapport mensuel est disponible.',
    lue: false,
  });

  await prisma.notification.createMany({ data: notificationsList });
  console.log('✅ Notifications créées:', notificationsList.length);

  // 7️⃣ Créer des Notes médicales
  const notesList: any[] = [];

  notesList.push({
    medecinId: medecins[0].id,
    patientId: patients[0].id,
    contenu: 'Patient en bonne santé générale. Tension artérielle normale. Recommander un suivi dans 6 mois.',
    statut: 'ACTIF' as any,
    piecesJointes: [],
  });

  notesList.push({
    medecinId: medecins[1].id,
    patientId: patients[1].id,
    contenu: 'Vaccination à jour. Croissance normale de l\'enfant. Prochaine consultation recommandée dans 3 mois.',
    statut: 'ACTIF' as any,
    piecesJointes: [],
  });

  notesList.push({
    medecinId: medecins[2].id,
    patientId: patients[2].id,
    contenu: 'Traitement prescrit pour acné. Revoir dans 2 semaines pour ajustement si nécessaire.',
    statut: 'ACTIF' as any,
    piecesJointes: [],
  });

  await prisma.noteMedicale.createMany({ data: notesList });
  console.log('✅ Notes médicales créées:', notesList.length);

  console.log('\n🎉 Seeding terminé avec succès !');
  console.log('\n📋 Comptes de test créés:');
  console.log('\n👤 Admin:');
  console.log('   Email: admin@medical.com');
  console.log('   Mot de passe: password123');
  console.log('\n🩺 Médecins:');
  console.log('   Email: jean.kouadio@medical.com (Cardiologie)');
  console.log('   Email: sophie.kone@medical.com (Pédiatrie)');
  console.log('   Email: michel.traore@medical.com (Dermatologie)');
  console.log('   Mot de passe: password123');
  console.log('\n🧑‍⚕️ Patients:');
  console.log('   Email: marie.yao@example.com');
  console.log('   Email: kouassi.bamba@example.com');
  console.log('   Email: fatou.diallo@example.com');
  console.log('   Mot de passe: password123');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
