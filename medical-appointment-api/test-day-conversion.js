// Test de la conversion date → jour de la semaine
// Comme dans le frontend AppointmentBooking.jsx

const getDayOfWeek = (date) => {
  if (!date) return null;
  const days = ['DIMANCHE', 'LUNDI', 'MARDI', 'MERCREDI', 'JEUDI', 'VENDREDI', 'SAMEDI'];
  const dateObj = date instanceof Date ? date : new Date(date);
  const dayIndex = dateObj.getDay();
  const dayName = days[dayIndex];

  console.log('🗓️ Conversion date → jour:', {
    dateInput: date,
    dateObject: dateObj.toISOString(),
    dateString: dateObj.toLocaleDateString('fr-FR'),
    dayIndex,
    dayName,
    fullDate: dateObj.toString()
  });

  return dayName;
};

console.log('=== TEST DE CONVERSION DE DATES ===\n');

// Test avec différentes dates de novembre 2025
console.log('Test 1: Lundi 18 novembre 2025');
const lundi = new Date(2025, 10, 18); // Mois 10 = novembre (0-indexed)
getDayOfWeek(lundi);

console.log('\nTest 2: Mardi 19 novembre 2025');
const mardi = new Date(2025, 10, 19);
getDayOfWeek(mardi);

console.log('\nTest 3: Mercredi 20 novembre 2025');
const mercredi = new Date(2025, 10, 20);
getDayOfWeek(mercredi);

console.log('\nTest 4: Jeudi 21 novembre 2025');
const jeudi = new Date(2025, 10, 21);
getDayOfWeek(jeudi);

console.log('\n=== VERIFICATION getDay() de JavaScript ===');
console.log('Date.prototype.getDay() retourne:');
console.log('  0 = Dimanche');
console.log('  1 = Lundi');
console.log('  2 = Mardi');
console.log('  3 = Mercredi');
console.log('  4 = Jeudi');
console.log('  5 = Vendredi');
console.log('  6 = Samedi');

// Test avec la date d'aujourd'hui
console.log('\n=== Aujourd\'hui ===');
const today = new Date();
console.log(`Date: ${today.toLocaleDateString('fr-FR')}`);
console.log(`getDay(): ${today.getDay()}`);
getDayOfWeek(today);
