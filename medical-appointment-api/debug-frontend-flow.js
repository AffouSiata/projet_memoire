const axios = require('axios');
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function debugFrontendFlow() {
  try {
    console.log('🔍 DEBUG: Simulation complète du flux de prise de RDV\n');
    console.log('=' .repeat(70));

    // 1. Se connecter en tant que patient
    let patient = await prisma.user.findFirst({
      where: {
        role: 'PATIENT',
        email: 'patient.test@example.com'
      }
    });

    if (!patient) {
      console.log('Création d\'un patient de test...');
      const hashedPassword = await bcrypt.hash('password123', 10);
      patient = await prisma.user.create({
        data: {
          email: 'patient.test@example.com',
          motDePasse: hashedPassword,
          nom: 'Test',
          prenom: 'Patient',
          telephone: '+225 0700000000',
          role: 'PATIENT',
          isActive: true
        }
      });
    }

    console.log(`\n✅ Patient: ${patient.prenom} ${patient.nom} (${patient.email})`);

    // Se connecter
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: patient.email,
      motDePasse: 'password123'
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Connexion réussie\n');

    // 2. Récupérer la liste des médecins
    console.log('📡 ÉTAPE 1: Récupération de la liste des médecins');
    console.log('=' .repeat(70));

    const medecinsResponse = await axios.get('http://localhost:3002/api/patients/medecins', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log(`✅ ${medecinsResponse.data.length} médecin(s) reçu(s)\n`);

    // Trouver un médecin avec des créneaux
    const medecinWithSlots = medecinsResponse.data.find(doc =>
      ['Dr. yao yao', 'Dr. afsa afsa', 'Dr. fabien fabien'].some(name =>
        `Dr. ${doc.prenom} ${doc.nom}` === name
      )
    );

    if (!medecinWithSlots) {
      console.log('❌ Aucun médecin avec créneaux trouvé dans la liste');
      await prisma.$disconnect();
      return;
    }

    console.log(`Médecin sélectionné: Dr. ${medecinWithSlots.prenom} ${medecinWithSlots.nom}`);
    console.log(`ID: ${medecinWithSlots.id}\n`);

    // 3. Sélectionner une date (prochain lundi)
    console.log('📡 ÉTAPE 2: Sélection d\'une date');
    console.log('=' .repeat(70));

    const today = new Date();
    const dayOfWeek = today.getDay();
    const daysUntilMonday = (1 - dayOfWeek + 7) % 7 || 7;
    const nextMonday = new Date(today);
    nextMonday.setDate(today.getDate() + daysUntilMonday);

    console.log(`Date sélectionnée: ${nextMonday.toLocaleDateString('fr-FR')} (LUNDI)\n`);

    // 4. Convertir en jour de la semaine (comme le fait le frontend)
    const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
    const dayIndex = nextMonday.getDay();
    const dayName = days[dayIndex];

    console.log(`Conversion: dayIndex=${dayIndex} → ${dayName}\n`);

    // 5. Récupérer les créneaux horaires du médecin
    console.log('📡 ÉTAPE 3: Récupération des créneaux horaires');
    console.log('=' .repeat(70));

    const timeSlotsUrl = `http://localhost:3002/api/timeslots/${medecinWithSlots.id}`;
    console.log(`URL: GET ${timeSlotsUrl}\n`);

    const timeSlotsResponse = await axios.get(timeSlotsUrl);

    console.log('✅ Réponse reçue:');
    console.log('Structure:', JSON.stringify(timeSlotsResponse.data, null, 2).substring(0, 500));
    console.log('\nClés disponibles:', Object.keys(timeSlotsResponse.data));

    // 6. Extraire les créneaux pour le jour sélectionné
    const timeSlotsForDay = timeSlotsResponse.data[dayName] || [];

    console.log(`\n📋 Créneaux pour ${dayName}: ${timeSlotsForDay.length}`);

    if (timeSlotsForDay.length === 0) {
      console.log('\n❌ PROBLÈME: Aucun créneau trouvé pour ce jour!');
      console.log('\nVérifions les créneaux disponibles pour ce médecin:');

      for (const [day, slots] of Object.entries(timeSlotsResponse.data)) {
        if (slots && slots.length > 0) {
          console.log(`   ${day}: ${slots.length} créneau(x)`);
          slots.forEach(slot => {
            console.log(`      → ${slot.heureDebut} - ${slot.heureFin}`);
          });
        }
      }

      // Essayer un autre jour
      const availableDays = Object.keys(timeSlotsResponse.data).filter(
        day => timeSlotsResponse.data[day] && timeSlotsResponse.data[day].length > 0
      );

      if (availableDays.length > 0) {
        const firstAvailableDay = availableDays[0];
        console.log(`\n💡 Suggestion: Essayez ${firstAvailableDay} à la place`);
        console.log(`   Créneaux disponibles: ${timeSlotsResponse.data[firstAvailableDay].length}`);

        // Calculer la date correspondante
        const dayMap = {
          'LUNDI': 1, 'MARDI': 2, 'MERCREDI': 3, 'JEUDI': 4,
          'VENDREDI': 5, 'SAMEDI': 6, 'DIMANCHE': 0
        };
        const targetDayIndex = dayMap[firstAvailableDay];
        const daysToAdd = (targetDayIndex - dayOfWeek + 7) % 7 || 7;
        const suggestedDate = new Date(today);
        suggestedDate.setDate(today.getDate() + daysToAdd);
        console.log(`   Date suggérée: ${suggestedDate.toLocaleDateString('fr-FR')}`);
      }

    } else {
      console.log('\n✅ Créneaux trouvés:');
      timeSlotsForDay.forEach(slot => {
        console.log(`   ${slot.heureDebut} → ${slot.heureFin}`);
      });

      // 7. Générer les créneaux de 30 minutes
      console.log('\n📡 ÉTAPE 4: Génération des créneaux de 30 min');
      console.log('=' .repeat(70));

      const generatedSlots = [];
      const slotDuration = 30;

      timeSlotsForDay.forEach(range => {
        const [startHour, startMin] = range.heureDebut.split(':').map(Number);
        const [endHour, endMin] = range.heureFin.split(':').map(Number);

        let currentMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;

        while (currentMinutes < endMinutes) {
          const hours = Math.floor(currentMinutes / 60);
          const mins = currentMinutes % 60;
          const timeString = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
          generatedSlots.push(timeString);
          currentMinutes += slotDuration;
        }
      });

      console.log(`✅ ${generatedSlots.length} créneaux de 30 min générés:`);
      console.log(`   ${generatedSlots.slice(0, 10).join(', ')}${generatedSlots.length > 10 ? '...' : ''}`);
    }

    console.log('\n' + '=' .repeat(70));
    console.log('🎯 RÉSULTAT:');
    console.log('=' .repeat(70));

    if (timeSlotsForDay.length > 0) {
      console.log('✅ Le flux fonctionne correctement!');
      console.log('   Les créneaux devraient s\'afficher dans le frontend.');
      console.log('\n💡 Si vous ne voyez toujours pas les créneaux:');
      console.log('   1. Videz le cache du navigateur (Ctrl+Shift+R)');
      console.log('   2. Vérifiez la console du navigateur pour des erreurs');
      console.log('   3. Assurez-vous de sélectionner le bon jour');
    } else {
      console.log('❌ Aucun créneau disponible pour le jour sélectionné');
      console.log('   → Sélectionnez un autre jour de la semaine');
    }

    await prisma.$disconnect();

  } catch (error) {
    console.error('\n❌ ERREUR:', error.response?.data || error.message);
    if (error.response) {
      console.log('\nStatus:', error.response.status);
      console.log('Data:', error.response.data);
    }
    await prisma.$disconnect();
    process.exit(1);
  }
}

debugFrontendFlow();
