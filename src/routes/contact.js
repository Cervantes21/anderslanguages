import express from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer';
import { validateContact } from '../middleware/validators.js';

const router = express.Router();

// Configurar transporter con auth opcional
const transportConfig = {
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT, 10),
  secure: process.env.SMTP_SECURE === 'true',
};
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transportConfig.auth = {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  };
}
const transporter = nodemailer.createTransport(transportConfig);

const CONTACT_SUBJECT = '**EN* CONTACT *** New message received';

router.post('/', validateContact, async (req, res) => {
  const { name, email, message } = req.body;

  try {
    // Guardar en BD
    const result = await pool.query(
      'INSERT INTO contacts(name, email, message) VALUES($1, $2, $3) RETURNING *',
      [name, email, message]
    );
    const contactEntry = result.rows[0];

    // Construir correo
    const mailBody = `
---- CONTACT ----
Name: ${contactEntry.name}
Email: ${contactEntry.email}
Message:
${contactEntry.message}
Timestamp: ${contactEntry.created_at}
`;

    // Enviar email (si auth no está definido, nodemailer lo omitirá)
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      to: process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      subject: CONTACT_SUBJECT,
      text: mailBody
    });

    return res.status(201).json({ success: true, data: contactEntry });
  } catch (err) {
    console.error('❌ Error en contact.js al procesar contacto:', err);
    return res.status(500).json({ success: false, message: 'Error interno del servidor' });
  }
});

export default router;
