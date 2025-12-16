const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const axios = require('axios');
const prisma = new PrismaClient();

async function testFrontendMedecinsAPI() {
  try {
    console.log('🧪 TEST: Simulation de la prise de rendez-vous patient\n');
    console.log('=' .repeat(60));

    // 1. Trouver ou créer un patient de test
    let patient = await prisma.user.findFirst({
      where: {
        role: 'PATIENT',
        email: 'patient.test@example.com'
      }
    });

    if (!patient) {
      console.log('📝 Création d\'un patient de test...');
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
      console.log(`✅ Patient créé: ${patient.prenom} ${patient.nom}\n`);
    } else {
      console.log(`✅ Patient trouvé: ${patient.prenom} ${patient.nom} (${patient.email})\n`);
    }

    // 2. Se connecter en tant que patient
    console.log('🔐 Connexion en tant que patient...');
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: patient.email,
      motDePasse: 'password123'
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Connexion réussie!\n');

    // 3. Appeler l'API des médecins (exactement comme le fait le frontend)
    console.log('📡 Appel de l\'API: GET /api/patients/medecins');
    console.log('=' .repeat(60));

    const medecinsResponse = await axios.get('http://localhost:3002/api/patients/medecins', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const medecinsAPI = medecinsResponse.data;

    console.log(`\n📋 RÉSULTAT: ${medecinsAPI.length} médecin(s) retourné(s) par l'API\n`);

    // 4. Afficher les médecins retournés
    if (medecinsAPI.length === 0) {
      console.log('❌ AUCUN médecin retourné par l\'API!');
    } else {
      console.log('Liste des médecins visibles pour les patients:\n');
      medecinsAPI.forEach((doc, index) => {
        console.log(`${index + 1}. 👨‍⚕️ Dr. ${doc.prenom} ${doc.nom}`);
        console.log(`   📍 Spécialité: ${doc.specialite || 'Non définie'}`);
        console.log(`   📧 Email: ${doc.email}`);
        console.log(`   🆔 ID: ${doc.id}`);
        console.log('');
      });
    }

    // 5. Vérifier dans la BDD
    console.log('=' .repeat(60));
    console.log('📊 VÉRIFICATION dans la base de données:\n');

    const allMedecins = await prisma.user.findMany({
      where: { role: 'MEDECIN' }
    });

    const approvedActive = allMedecins.filter(m => m.statutValidation === 'APPROVED' && m.isActive);
    const approvedInactive = allMedecins.filter(m => m.statutValidation === 'APPROVED' && !m.isActive);
    const pending = allMedecins.filter(m => m.statutValidation === 'PENDING');
    const rejected = allMedecins.filter(m => m.statutValidation === 'REJECTED');

    console.log(`Total médecins en BDD: ${allMedecins.length}`);
    console.log(`  ✅ APPROUVÉS et ACTIFS: ${approvedActive.length} (devraient être visibles)`);
    console.log(`  ⚠️  APPROUVÉS mais INACTIFS: ${approvedInactive.length} (non visibles)`);
    console.log(`  ⏳ EN ATTENTE: ${pending.length} (non visibles)`);
    console.log(`  ❌ REJETÉS: ${rejected.length} (non visibles)`);

    // 6. Résultat du test
    console.log('\n' + '=' .repeat(60));
    console.log('🎯 RÉSULTAT DU TEST:\n');

    if (medecinsAPI.length === approvedActive.length) {
      console.log('✅ LE FILTRAGE FONCTIONNE CORRECTEMENT!');
      console.log(`   → ${medecinsAPI.length} médecins approuvés et actifs`);
      console.log(`   → ${medecinsAPI.length} médecins retournés par l'API`);
      console.log('\n✅ Seuls les médecins APPROUVÉS par l\'admin sont visibles!');
    } else {
      console.log('❌ PROBLÈME DÉTECTÉ!');
      console.log(`   → ${approvedActive.length} médecins approuvés et actifs en BDD`);
      console.log(`   → ${medecinsAPI.length} médecins retournés par l'API`);
    }

    // 7. Détails des médecins approuvés actifs
    if (approvedActive.length > 0) {
      console.log('\n' + '=' .repeat(60));
      console.log('📝 LISTE DES MÉDECINS APPROUVÉS ET ACTIFS:\n');
      approvedActive.forEach((doc, index) => {
        console.log(`${index + 1}. Dr. ${doc.prenom} ${doc.nom} - ${doc.specialite || 'Non définie'}`);
      });
    }

    // 8. Médecins NON visibles
    const nonVisibles = allMedecins.filter(m => m.statutValidation !== 'APPROVED' || !m.isActive);
    if (nonVisibles.length > 0) {
      console.log('\n' + '=' .repeat(60));
      console.log('🚫 MÉDECINS NON VISIBLES (normalement filtrés):\n');
      nonVisibles.forEach((doc, index) => {
        const raison = !doc.isActive ? 'INACTIF' : doc.statutValidation;
        console.log(`${index + 1}. Dr. ${doc.prenom} ${doc.nom} - ${doc.specialite || 'Non définie'}`);
        console.log(`   → Raison: ${raison}`);
      });
    }

    console.log('\n' + '=' .repeat(60));

    await prisma.$disconnect();

  } catch (error) {
    console.error('\n❌ ERREUR:', error.response?.data || error.message);
    await prisma.$disconnect();
    process.exit(1);
  }
}

testFrontendMedecinsAPI();
