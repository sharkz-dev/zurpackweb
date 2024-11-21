import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configurar nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_TO,
      subject: `Nuevo mensaje de contacto: ${subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
            Nuevo Mensaje de Contacto
          </h2>
          
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a5568; margin-top: 0;">Datos del contacto:</h3>
            <ul style="list-style: none; padding: 0;">
              <li style="margin-bottom: 10px;"><strong>Nombre:</strong> ${name}</li>
              <li style="margin-bottom: 10px;"><strong>Email:</strong> ${email}</li>
              <li style="margin-bottom: 10px;"><strong>Teléfono:</strong> ${phone || 'No proporcionado'}</li>
              <li style="margin-bottom: 10px;"><strong>Asunto:</strong> ${subject}</li>
            </ul>
          </div>

          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px;">
            <h3 style="color: #4a5568; margin-top: 0;">Mensaje:</h3>
            <p style="color: #4a5568; white-space: pre-line;">${message}</p>
          </div>

          <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #718096; font-size: 0.875rem;">
            <p>Este mensaje fue enviado a través del formulario de contacto del sitio web.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    
    // Enviar correo de confirmación al remitente
    const confirmationMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Hemos recibido tu mensaje - Zurpack',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d3748;">¡Gracias por contactarnos!</h2>
          <p style="color: #4a5568;">
            Hemos recibido tu mensaje y nos pondremos en contacto contigo lo antes posible.
          </p>
          <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #4a5568; margin-top: 0;">Resumen de tu mensaje:</h3>
            <p><strong>Asunto:</strong> ${subject}</p>
            <p><strong>Mensaje:</strong></p>
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <p style="color: #718096; font-size: 0.875rem;">
            Este es un mensaje automático, por favor no responder a este correo.
          </p>
        </div>
      `
    };

    await transporter.sendMail(confirmationMailOptions);

    res.json({ message: 'Mensaje enviado exitosamente' });
  } catch (error) {
    console.error('Error al enviar mensaje:', error);
    res.status(500).json({ message: 'Error al enviar el mensaje' });
  }
});

export default router;