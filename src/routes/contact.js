import express from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer';
import { validateContact } from '../middleware/validators.js';

const router = express.Router();

// Configure transporter for sending emails
const transportConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
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
    // Insert into MySQL
    const [insertResult] = await pool.query(
      'INSERT INTO contacts(name, email, message) VALUES (?, ?, ?)',
      [name, email, message]
    );

    // Retrieve the new entry
    const [rows] = await pool.query(
      'SELECT * FROM contacts WHERE id = ?',
      [insertResult.insertId]
    );
    const contactEntry = rows[0];

    // Build email content
    const mailBody = `
---- CONTACT ----
Name: ${contactEntry.name}
Email: ${contactEntry.email}
Message:
${contactEntry.message}
Timestamp: ${contactEntry.created_at}
`;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      to:   process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      subject: CONTACT_SUBJECT,
      text: mailBody
    });

    return res.status(201).json({ success: true, data: contactEntry });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
});

export default router;
