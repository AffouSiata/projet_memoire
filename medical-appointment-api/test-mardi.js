// Test spécifique pour le MARDI du Dr. afsa
const generateTimeSlots = (timeSlotRanges) => {
  const slots = [];
  const slotDuration = 30;

  timeSlotRanges.forEach(range => {
    const [startHour, startMin] = range.heureDebut.split(':').map(Number);
    const [endHour, endMin] = range.heureFin.split(':').map(Number);

    let currentMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    console.log(`Génération des créneaux pour: ${range.heureDebut} - ${range.heureFin}`);
    console.log(`Début (minutes): ${currentMinutes} (${startHour}:${String(startMin).padStart(2, '0')})`);
    console.log(`Fin (minutes): ${endMinutes} (${endHour}:${String(endMin).padStart(2, '0')})`);

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const mins = currentMinutes % 60;
      const timeString = `${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`;
      slots.push(timeString);
      currentMinutes += slotDuration;
    }
  });

  return slots;
};

// Dr. afsa - MARDI: 08:00 - 14:30
const mardiData = [
  {
    heureDebut: "08:00",
    heureFin: "14:30"
  }
];

console.log('=== Dr. afsa - MARDI ===\n');
const slots = generateTimeSlots(mardiData);

console.log('\n📋 Créneaux générés:');
slots.forEach((slot, index) => {
  console.log(`  ${index + 1}. ${slot}`);
});

console.log(`\n✅ Total: ${slots.length} créneaux`);
console.log(`\n🕐 Premier créneau: ${slots[0]}`);
console.log(`🕐 Dernier créneau: ${slots[slots.length - 1]}`);
