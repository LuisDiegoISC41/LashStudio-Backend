const bcrypt = require('bcryptjs');
const { Admin } = require('../models');

const initializeData = async () => {
    try {
        const admins = await Admin.findAll();
        
        for (let admin of admins) {
            const pwd = admin.password;
            
            // Si la contraseña existe y NO empieza con $2a (formato de bcrypt)
            if (pwd && !pwd.startsWith('$2')) {
                const hashedPassword = await bcrypt.hash(pwd, 10);
                admin.password = hashedPassword;
                
                await admin.save();
                console.log(`[DataInitializer] ✅ Contraseña re-encriptada para admin: ${admin.correo}`);
            }
        }
    } catch (error) {
        console.error(`[DataInitializer] ❌ Error al re-encriptar: ${error.message}`);
        console.error(`[DataInitializer] Tip: Revisa que la columna 'Password' en la DB acepte 100 caracteres.`);
    }
};

module.exports = initializeData;