const axios = require('axios');

// Test avec le token d'un utilisateur patient
// Vous devez d'abord vous connecter pour obtenir un token valide

async function testSettings() {
  try {
    // D'abord, login pour obtenir un token
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'marie.yao@example.com',
      motDePasse: 'password123'
    });

    const token = loginResponse.data.accessToken;
    console.log('Token obtenu:', token.substring(0, 20) + '...');

    // Récupérer les paramètres actuels
    const getResponse = await axios.get('http://localhost:3002/api/patients/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('\nParamètres actuels:');
    console.log('Langue:', getResponse.data.langue);
    console.log('Theme:', getResponse.data.theme);
    console.log('2FA:', getResponse.data.twoFactorAuth);

    // Mettre à jour la langue
    console.log('\nMise à jour de la langue vers "en"...');
    const updateResponse = await axios.patch('http://localhost:3002/api/patients/preferences', {
      langue: 'en'
    }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Réponse de mise à jour:', updateResponse.data);

    // Vérifier que ça a bien été mis à jour
    const verifyResponse = await axios.get('http://localhost:3002/api/patients/me', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('\nParamètres après mise à jour:');
    console.log('Langue:', verifyResponse.data.langue);
    console.log('\n✅ Test réussi! La langue a été changée.');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

testSettings();
