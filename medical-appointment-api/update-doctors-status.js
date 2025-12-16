const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Updating existing doctors to APPROVED status...');

  try {
    // Update all doctors with PENDING or null status to APPROVED
    const result = await prisma.user.updateMany({
      where: {
        role: 'MEDECIN',
        OR: [
          { statutValidation: 'PENDING' },
          { statutValidation: null }
        ]
      },
      data: {
        statutValidation: 'APPROVED',
        isActive: true
      }
    });

    console.log(`✅ Updated ${result.count} doctors to APPROVED status`);

    // List all doctors and their status
    const doctors = await prisma.user.findMany({
      where: {
        role: 'MEDECIN'
      },
      select: {
        id: true,
        nom: true,
        prenom: true,
        email: true,
        specialite: true,
        statutValidation: true,
        isActive: true
      }
    });

    console.log('\n📋 Current doctors status:');
    doctors.forEach(doc => {
      console.log(`  - Dr. ${doc.prenom} ${doc.nom} (${doc.specialite}) - ${doc.statutValidation} - ${doc.isActive ? 'Active' : 'Inactive'}`);
    });
  } catch (error) {
    console.error('❌ Error updating doctors:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
