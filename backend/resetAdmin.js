import mongoose from 'mongoose';
import Admin from './models/Admin.js';
import dotenv from 'dotenv';

dotenv.config();

const resetAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // Eliminar todos los admins existentes
    await Admin.deleteMany({});
    console.log('Base de datos limpia - Todos los admins eliminados');

    // Crear nuevo admin
    const admin = await Admin.create({
      username: 'admin',
      password: 'zurpack123Admin...' // Asegúrate de usar esta contraseña exacta
    });
    
    console.log('Nuevo admin creado exitosamente:');
    console.log('Username:', admin.username);
    console.log('ID:', admin._id);
    
    // Verificar que se puede encontrar el admin
    const verifyAdmin = await Admin.findOne({ username: 'admin' });
    if (verifyAdmin) {
      console.log('Verificación exitosa - Admin encontrado en la base de datos');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

resetAdmin();