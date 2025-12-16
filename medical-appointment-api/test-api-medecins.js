const { PrismaClient } = require('@prisma/client');
const axios = require('axios');
const prisma = new PrismaClient();

async function testMedecinsAPI() {
  try {
    // 1. Récupérer un patient de la base de données
    const patient = await prisma.user.findFirst({
      where: { role: 'PATIENT', isActive: true }
    });

    if (!patient) {
      console.log('❌ Aucun patient actif trouvé dans la base de données');
      await prisma.$disconnect();
      return;
    }

    console.log(`✅ Patient trouvé: ${patient.prenom} ${patient.nom} (${patient.email})`);

    // 2. Se connecter avec ce patient (utiliser le mot de passe par défaut)
    let token;
    try {
      const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
        email: patient.email,
        motDePasse: 'password123'
      });
      token = loginResponse.data.accessToken;
      console.log('✅ Connexion réussie en tant que patient');
    } catch (loginError) {
      console.log('❌ Impossible de se connecter. Essayons de vérifier directement la base de données...\n');

      // Si la connexion échoue, on vérifie directement dans la BDD
      const medecins = await prisma.user.findMany({
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
          email: true,
          statutValidation: true,
          isActive: true
        },
        orderBy: {
          nom: 'asc'
        }
      });

      console.log(`📋 Médecins APPROUVÉS et ACTIFS (via BDD directe):`);
      console.log(`Nombre total: ${medecins.length}\n`);

      medecins.forEach((medecin, index) => {
        console.log(`${index + 1}. Dr. ${medecin.prenom} ${medecin.nom}`);
        console.log(`   Spécialité: ${medecin.specialite || 'NON DÉFINIE'}`);
        console.log(`   Email: ${medecin.email}`);
        console.log(`   Statut: ${medecin.statutValidation} | Actif: ${medecin.isActive}`);
        console.log(`   ID: ${medecin.id}\n`);
      });

      await prisma.$disconnect();
      return;
    }

    // 3. Récupérer la liste des médecins via l'API
    const medecinsResponse = await axios.get('http://localhost:3002/api/patients/medecins', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('\n📋 Liste des médecins disponibles (via API):');
    console.log(`Nombre total: ${medecinsResponse.data.length}\n`);

    medecinsResponse.data.forEach((medecin, index) => {
      console.log(`${index + 1}. Dr. ${medecin.prenom} ${medecin.nom}`);
      console.log(`   Spécialité: ${medecin.specialite || 'NON DÉFINIE'}`);
      console.log(`   Email: ${medecin.email}`);
      console.log(`   ID: ${medecin.id}\n`);
    });

    // 4. Comparer avec ce qui est dans la BDD
    const medecinsBDD = await prisma.user.findMany({
      where: {
        role: 'MEDECIN',
        statutValidation: 'APPROVED',
        isActive: true
      }
    });

    console.log('📊 Comparaison:');
    console.log(`   Médecins en BDD (APPROVED + ACTIVE): ${medecinsBDD.length}`);
    console.log(`   Médecins retournés par l'API: ${medecinsResponse.data.length}`);

    if (medecinsBDD.length === medecinsResponse.data.length) {
      console.log('   ✅ Le filtrage fonctionne correctement!');
    } else {
      console.log('   ⚠️  Différence détectée!');
    }

    await prisma.$disconnect();

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
    await prisma.$disconnect();
  }
}

testMedecinsAPI();
