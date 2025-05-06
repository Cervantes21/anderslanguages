import express from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer';

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

// Create a new proposal
router.post('/', async (req, res) => {
  const { name, email, whatsapp, program, boletin, proposal_type } = req.body;

  if (!name || !email || !program || !proposal_type) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    // Insert into MySQL
    const [insertResult] = await pool.query(
      `INSERT INTO proposals (
         name, email, whatsapp, program, boletin, proposal_type
       ) VALUES (?, ?, ?, ?, ?, ?)` ,
      [name, email, whatsapp, program, boletin, proposal_type]
    );

    // Retrieve the new entry
    const [rows] = await pool.query(
      'SELECT * FROM proposals WHERE id = ?',
      [insertResult.insertId]
    );
    const prop = rows[0];

    // Build email body
    const mailBody = `
---- PROPOSAL ----
Name: ${prop.name}
Email: ${prop.email}
WhatsApp: ${prop.whatsapp || 'N/A'}
Program: ${prop.program}
Newsletter subscription: ${prop.boletin ? 'Yes' : 'No'}
Proposal Type: ${prop.proposal_type}
Timestamp: ${prop.created_at}
`;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      to:   process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      subject: getProposalSubject(prop.proposal_type, prop.name),
      text: mailBody,
    });

    return res.status(201).json({
      message: 'Proposal created successfully',
      data: prop,
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// Fetch all proposals
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM proposals');
    return res.status(200).json({
      message: 'Proposals retrieved successfully',
      data: rows,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
