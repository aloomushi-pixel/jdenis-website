const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function insertUser() {
    try {
        console.log('🔐 Insertando usuario personalizado...');

        // Hash de la contraseña
        const passwordHash = await bcrypt.hash('Darepamaxidi7', 10);

        // Intentar crear o actualizar el usuario
        const user = await prisma.user.upsert({
            where: { email: 'caballeroangela49@gmail.com' },
            update: {
                passwordHash: passwordHash,
                fullName: 'Angela Caballero',
                role: 'ADMIN',
                isActive: true
            },
            create: {
                email: 'caballeroangela49@gmail.com',
                passwordHash: passwordHash,
                fullName: 'Angela Caballero',
                role: 'ADMIN',
                isActive: true
            }
        });

        console.log('✅ Usuario creado/actualizado exitosamente:');
        console.log('   📧 Email:', user.email);
        console.log('   👤 Nombre:', user.fullName);
        console.log('   🔑 Rol:', user.role);
        console.log('   🆔 ID:', user.id);
        console.log('\n🎉 Puedes ingresar con:');
        console.log('   Email: caballeroangela49@gmail.com');
        console.log('   Contraseña: Darepamaxidi7');

    } catch (error) {
        console.error('❌ Error al insertar usuario:', error.message);
        process.exit(1);
    } finally {
        await prisma.$disconnect();
    }
}

insertUser();
