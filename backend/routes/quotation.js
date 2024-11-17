import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configurar el transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

// Ruta para enviar cotización
router.post('/', async (req, res) => {  // Cambiado de '/send-quotation' a '/'
  try {
    console.log('Recibida solicitud de cotización:', req.body);
    const { rut, firstName, lastName, phone, email, items } = req.body;

    // Crear el contenido del correo
    const itemsList = items.map(item => 
      `- ${item.name} (${item.category}) - Cantidad: ${item.quantity}`
    ).join('\n');

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: 'Nueva Solicitud de Cotización',
      html: `
        <h2>Nueva solicitud de cotización</h2>
        <h3>Datos del cliente:</h3>
        <ul>
          <li><strong>RUT:</strong> ${rut}</li>
          <li><strong>Nombre:</strong> ${firstName} ${lastName}</li>
          <li><strong>Teléfono:</strong> ${phone}</li>
          <li><strong>Correo:</strong> ${email}</li>
        </ul>
        <h3>Productos solicitados:</h3>
        <ul>
          ${items.map(item => `
            <li>
              <strong>${item.name}</strong> (${item.category}) - Cantidad: ${item.quantity}
            </li>
          `).join('')}
        </ul>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log('Correo enviado exitosamente');
    res.json({ message: 'Cotización enviada exitosamente' });
  } catch (error) {
    console.error('Error al enviar cotización:', error);
    res.status(500).json({ message: error.message });
  }
});

export default router;