import { useState, useEffect } from 'react';
import PatientLayout from '../../components/layout/PatientLayout';
import patientService from '../../services/patientService';

const TestSettings = () => {
  const [langue, setLangue] = useState('fr');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      console.log('🔄 Chargement des paramètres...');
      const response = await patientService.getProfile();
      console.log('✅ Profil reçu:', response.data);
      setLangue(response.data.langue);
      setMessage(`Langue actuelle: ${response.data.langue}`);
    } catch (error) {
      console.error('❌ Erreur chargement:', error);
      setMessage('Erreur: ' + error.message);
    }
  };

  const saveSettings = async () => {
    try {
      setLoading(true);
      setMessage('Sauvegarde en cours...');

      console.log('📤 Envoi de la langue:', langue);

      const response = await patientService.updatePreferences({ langue });

      console.log('✅ Réponse:', response.data);
      setMessage(`✅ Sauvegardé! Langue: ${response.data.langue}`);

      // Recharger pour vérifier
      setTimeout(loadSettings, 1000);

    } catch (error) {
      console.error('❌ Erreur sauvegarde:', error);
      setMessage('❌ Erreur: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <PatientLayout>
      <div className="min-h-screen bg-slate-50 dark:bg-gray-900 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-slate-800 dark:text-white">Test Paramètres</h1>

          {/* Message */}
          <div className="bg-blue-100 border border-blue-400 rounded-lg p-4 mb-6">
            <p className="text-blue-900 font-mono">{message}</p>
          </div>

          {/* Sélection langue */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Langue actuelle: {langue}</h2>

            <div className="flex gap-4">
              <button
                onClick={() => {
                  console.log('🇫🇷 Changement vers FR');
                  setLangue('fr');
                }}
                className={`px-6 py-3 rounded-lg font-bold ${
                  langue === 'fr'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                🇫🇷 Français
              </button>

              <button
                onClick={() => {
                  console.log('🇬🇧 Changement vers EN');
                  setLangue('en');
                }}
                className={`px-6 py-3 rounded-lg font-bold ${
                  langue === 'en'
                    ? 'bg-green-500 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                🇬🇧 English
              </button>
            </div>
          </div>

          {/* Bouton sauvegarder */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <button
              onClick={() => {
                console.log('💾 Clic sur Sauvegarder, langue=', langue);
                saveSettings();
              }}
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed text-xl"
            >
              {loading ? '⏳ Sauvegarde...' : '💾 SAUVEGARDER'}
            </button>
          </div>

          {/* Instructions */}
          <div className="mt-8 bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <h3 className="font-bold text-yellow-900 mb-2">📝 Instructions:</h3>
            <ol className="list-decimal list-inside space-y-2 text-yellow-900">
              <li>Ouvrez la console (F12)</li>
              <li>Cliquez sur une langue différente</li>
              <li>Regardez les logs dans la console</li>
              <li>Cliquez sur SAUVEGARDER</li>
              <li>Vérifiez que ça affiche "✅ Sauvegardé!"</li>
              <li>Rechargez la page (F5) et vérifiez que la langue est conservée</li>
            </ol>
          </div>
        </div>
      </div>
    </PatientLayout>
  );
};

export default TestSettings;
