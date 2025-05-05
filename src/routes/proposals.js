import express from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configurar transporter para envío de emails
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

// Genera el subject según el tipo de propuesta
function getProposalSubject(type, name) {
  switch (type) {
    case 'prices':
      return `**EN* PROPOSAL DIRECT *** Spanish Immersion for ${name}`;
    case 'proposal-general':
      return `**EN* PROPOSAL PAGES *** Spanish Immersion for ${name}`;
    case 'proposal-online':
      return `**EN* PROPOSAL ONLINE *** Spanish Immersion for ${name}`;
    case 'proposal-ads':
      return `**EN* PROPOSAL ADS *** Spanish Immersion for ${name}`;
    case 'proposal-specials':
      return `**EN* PROPOSAL SPECIALS *** Spanish Immersion for ${name}`;
    default:
      return `**EN* PROPOSAL *** Spanish Immersion for ${name}`;
  }
}

// Endpoint to create a new proposal
router.post('/', async (req, res) => {
  const { name, email, whatsapp, program, boletin, proposal_type } = req.body;

  // Validación de campos obligatorios
  if (!name || !email || !program || !proposal_type) {
    return res.status(400).json({ error: 'All required fields must be filled out' });
  }

  try {
    // Insertar en la base de datos
    const result = await pool.query(
      `INSERT INTO proposals(
         name, email, whatsapp, program, boletin, proposal_type
       ) VALUES($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [name, email, whatsapp, program, boletin, proposal_type]
    );
    const prop = result.rows[0];

    // Construir cuerpo del correo
    const mailBody = `
---- PROPOSAL ----
Name: ${prop.name}
Email: ${prop.email}
WhatsApp: ${prop.whatsapp || 'N/A'}
Program: ${prop.program}
Boletin: ${prop.boletin ? 'Yes' : 'No'}
Proposal Type: ${prop.proposal_type}
Timestamp: ${prop.created_at}
`;

    // Enviar email desde y hacia la cuenta configurada
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      to: process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      subject: getProposalSubject(prop.proposal_type, prop.name),
      text: mailBody,
    });

    return res.status(201).json({
      message: 'Proposal created successfully',
      data: prop,
    });
  } catch (error) {
    console.error('Error en proposals.js:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Endpoint to obtener todas las propuestas
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM proposals');
    return res.status(200).json({
      message: 'Proposals list retrieved successfully',
      data: result.rows,
    });
  } catch (error) {
    console.error('Error retrieving data from the database:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
