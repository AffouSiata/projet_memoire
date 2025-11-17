const axios = require('axios');

async function resetLang() {
  try {
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'marie.yao@example.com',
      motDePasse: 'password123'
    });

    const token = loginResponse.data.accessToken;

    await axios.patch('http://localhost:3002/api/patients/preferences', {
      langue: 'fr'
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Langue remise à "fr"');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

resetLang();
