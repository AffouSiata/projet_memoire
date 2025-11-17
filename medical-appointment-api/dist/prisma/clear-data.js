"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
async function clearDatabase() {
    console.log('🗑️  Début de la suppression des données...');
    try {
        console.log('Suppression des notifications...');
        await prisma.notification.deleteMany();
        console.log('Suppression des notes médicales...');
        await prisma.noteMedicale.deleteMany();
        console.log('Suppression des créneaux horaires...');
        await prisma.timeSlot.deleteMany();
        console.log('Suppression des rendez-vous...');
        await prisma.rendezVous.deleteMany();
        console.log('Suppression des utilisateurs (sauf admin)...');
        await prisma.user.deleteMany({
            where: {
                email: {
                    not: 'admin@medical.com',
                },
            },
        });
        console.log('\n✅ Toutes les données ont été supprimées avec succès !');
        console.log('📊 La structure de la base de données est intacte.');
        console.log('👤 Le compte admin a été préservé (admin@medical.com).\n');
        console.log('💡 Vous pouvez maintenant créer vos propres comptes de test.\n');
    }
    catch (error) {
        console.error('❌ Erreur lors de la suppression:', error);
        process.exit(1);
    }
    finally {
        await prisma.$disconnect();
    }
}
clearDatabase();
//# sourceMappingURL=clear-data.js.map