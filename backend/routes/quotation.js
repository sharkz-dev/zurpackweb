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
   console.log('Recibida solicitud de cotización:', req.body);
   const { rut, firstName, lastName, phone, email, items } = req.body;

   const mailOptions = {
     from: process.env.EMAIL_USER,
     to: process.env.EMAIL_TO,
     subject: 'Nueva Solicitud de Cotización',
     html: `
       <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
         <h2 style="color: #2d3748; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px;">
           Nueva Solicitud de Cotización
         </h2>
         
         <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
           <h3 style="color: #4a5568; margin-top: 0;">Datos del cliente:</h3>
           <ul style="list-style: none; padding: 0;">
             <li style="margin-bottom: 10px;"><strong>RUT:</strong> ${rut}</li>
             <li style="margin-bottom: 10px;"><strong>Nombre:</strong> ${firstName} ${lastName}</li>
             <li style="margin-bottom: 10px;"><strong>Teléfono:</strong> ${phone}</li>
             <li style="margin-bottom: 10px;"><strong>Correo:</strong> ${email}</li>
           </ul>
         </div>

         <div style="background-color: #f7fafc; padding: 20px; border-radius: 8px;">
           <h3 style="color: #4a5568; margin-top: 0;">Productos solicitados:</h3>
           <ul style="list-style: none; padding: 0;">
             ${items.map(item => `
               <li style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #e2e8f0;">
                 <div style="margin-bottom: 5px;">
                   <strong>${item.name}</strong> (${item.category})
                 </div>
                 <div style="color: #4a5568;">
                   ${item.hasSizeVariants ? `Tamaño: ${item.selectedSize}<br>` : ''}
                   Cantidad: ${item.quantity}
                 </div>
               </li>
             `).join('')}
           </ul>
         </div>

         <div style="margin-top: 20px; padding-top: 20px; border-top: 2px solid #e2e8f0; color: #718096; font-size: 0.875rem;">
           <p>Esta cotización fue enviada a través del sitio web.</p>
         </div>
       </div>
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