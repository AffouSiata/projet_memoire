// Simulate the frontend timeslot generation logic

const generateTimeSlots = (timeSlotRanges) => {
  const slots = [];
  const slotDuration = 30; // Créneaux de 30 minutes

  console.log('🕐 Génération de créneaux depuis:', timeSlotRanges);

  timeSlotRanges.forEach(range => {
    const [startHour, startMin] = range.heureDebut.split(':').map(Number);
    const [endHour, endMin] = range.heureFin.split(':').map(Number);

    // Convertir en minutes totales pour faciliter le calcul
    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    console.log(`\nTraitement du range: ${range.heureDebut} - ${range.heureFin}`);
    console.log(`Start minutes: ${currentMinutes}, End minutes: ${endMinutes}`);

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;
      const timeString = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      slots.push(timeString);

      currentMinutes += slotDuration;
    }
  });

  console.log('\n✅ Créneaux générés:', slots);
  console.log(`Total: ${slots.length} créneaux`);

  return slots;
};

// Test avec les données du Dr. afsa pour DIMANCHE
const dimancheData = [
  {
    heureDebut: "09:00",
    heureFin: "12:00"
  }
];

console.log('=== TEST DIMANCHE ===');
generateTimeSlots(dimancheData);

// Test avec MERCREDI
const mercrediiData = [
  {
    heureDebut: "09:00",
    heureFin: "18:00"
  }
];

console.log('\n\n=== TEST MERCREDI ===');
generateTimeSlots(mercrediiData);

// Test avec JEUDI (a un timing non standard qui se termine à 14:50)
const jeudiData = [
  {
    heureDebut: "09:00",
    heureFin: "14:50"
  }
];

console.log('\n\n=== TEST JEUDI ===');
generateTimeSlots(jeudiData);
