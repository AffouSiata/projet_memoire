const axios = require('axios');

async function checkSettings() {
  try {
    // Login
    console.log('🔐 Connexion...');
    const loginResponse = await axios.post('http://localhost:3002/api/auth/login', {
      email: 'marie.yao@example.com',
      motDePasse: 'password123'
    });

    const token = loginResponse.data.accessToken;
    console.log('✅ Connecté\n');

    // Vérifier paramètres AVANT
    const before = await axios.get('http://localhost:3002/api/patients/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('📋 PARAMÈTRES AVANT:');
    console.log('  Langue:', before.data.langue);
    console.log('  Theme:', before.data.theme);
    console.log('  Email notifs:', before.data.preferencesNotifEmail);
    console.log('  SMS notifs:', before.data.preferencesNotifSms);
    console.log('  Rappels:', before.data.preferencesRappels);
    console.log('  Promotions:', before.data.preferencesPromotions);
    console.log('  2FA:', before.data.twoFactorAuth);
    console.log('  Biometric:', before.data.biometricAuth);

    // Changer vers English + autres paramètres
    console.log('\n🔄 Mise à jour vers English + Dark Mode...');
    const updateResponse = await axios.patch('http://localhost:3002/api/patients/preferences', {
      langue: 'en',
      theme: 'SOMBRE',
      preferencesNotifSms: true,
      preferencesRappels: false,
      twoFactorAuth: true
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('✅ Réponse mise à jour:', updateResponse.status);

    // Vérifier paramètres APRES
    const after = await axios.get('http://localhost:3002/api/patients/me', {
      headers: { Authorization: `Bearer ${token}` }
    });

    console.log('\n📋 PARAMÈTRES APRES:');
    console.log('  Langue:', after.data.langue);
    console.log('  Theme:', after.data.theme);
    console.log('  Email notifs:', after.data.preferencesNotifEmail);
    console.log('  SMS notifs:', after.data.preferencesNotifSms);
    console.log('  Rappels:', after.data.preferencesRappels);
    console.log('  Promotions:', after.data.preferencesPromotions);
    console.log('  2FA:', after.data.twoFactorAuth);
    console.log('  Biometric:', after.data.biometricAuth);

    // Vérifications
    console.log('\n🔍 VÉRIFICATIONS:');
    if (after.data.langue === 'en') {
      console.log('  ✅ Langue changée vers "en"');
    } else {
      console.log('  ❌ Langue NON changée! Toujours:', after.data.langue);
    }

    if (after.data.theme === 'SOMBRE') {
      console.log('  ✅ Theme changé vers "SOMBRE"');
    } else {
      console.log('  ❌ Theme NON changé! Toujours:', after.data.theme);
    }

    if (after.data.preferencesNotifSms === true) {
      console.log('  ✅ SMS notifs activées');
    } else {
      console.log('  ❌ SMS notifs NON activées');
    }

    if (after.data.preferencesRappels === false) {
      console.log('  ✅ Rappels désactivés');
    } else {
      console.log('  ❌ Rappels NON désactivés');
    }

    if (after.data.twoFactorAuth === true) {
      console.log('  ✅ 2FA activé');
    } else {
      console.log('  ❌ 2FA NON activé');
    }

    console.log('\n✅ TEST TERMINÉ');

  } catch (error) {
    console.error('❌ Erreur:', error.response?.data || error.message);
  }
}

checkSettings();
