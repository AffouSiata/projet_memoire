const axios = require('axios');

async function testGetMedecins() {
  try {
    // D'abord, se connecter en tant que patient
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'marie.yao@example.com',
      motDePasse: 'password123'
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Connexion réussie en tant que patient');
    console.log('Token:', token.substring(0, 20) + '...');

    // Récupérer la liste des médecins
    const medecinsResponse = await axios.get('http://localhost:3002/api/patients/medecins', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('\n📋 Liste des médecins disponibles:');
    console.log('Nombre total:', medecinsResponse.data.length);
    console.log('\nDétails:');
    medecinsResponse.data.forEach((medecin, index) => {
      console.log(`\n${index + 1}. Dr. ${medecin.prenom} ${medecin.nom}`);
      console.log(`   Spécialité: ${medecin.specialite || 'NON DÉFINIE'}`);
      console.log(`   Email: ${medecin.email}`);
      console.log(`   ID: ${medecin.id}`);
    });

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testGetMedecins();
