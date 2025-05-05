import express from 'express';
import pool from '../db.js';
import nodemailer from 'nodemailer';

const router = express.Router();

// Configure transporter for sending emails
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

function getBookingSubject(type) {
  switch (type) {
    case 'reservations-spain':
      return '**EN* BOOKING SEVILLA *** Spanish immersion: your booking';
    case 'reservations-mexico':
      return '**EN* BOOKING CUERNAVACA *** Spanish immersion: your booking';
    case 'specials-all':
      return '**EN* BOOKING SPECIALS ALL *** Spanish immersion: your reservation';
    case 'specials-sev':
      return '**EN* BOOKING SPECIALS SEV *** Spanish immersion: your reservation';
    default:
      return '**EN* BOOKING *** Spanish immersion: your booking';
  }
}

router.post('/', async (req, res) => {
  let {
    startdate, altdate, firstname, lastname, dob,
    citizenship, address, cell, recell, email, remail,
    program, schedule, instructor, room, extranight,
    duration, business, cultural, fiestas, gastronomic,
    golf, luxury, meetgreet, comment, company, bill,
    second, agree, residence, language, reservation_type
  } = req.body;

  // Validate required fields
  if (!firstname || !lastname || !email || !reservation_type || !startdate) {
    return res.status(400).json({ error: 'Required fields must be provided' });
  }

  // Parse boolean values
  extranight  = extranight === true || extranight === 'true';
  business    = business === true || business === 'true';
  cultural    = typeof cultural === 'string' ? (cultural !== '-' && cultural !== '0') : Boolean(cultural);
  fiestas     = fiestas === '1' || fiestas === 1 || fiestas === 'true';
  gastronomic = typeof gastronomic === 'string' ? (gastronomic !== '-' && gastronomic !== '0') : Boolean(gastronomic);
  golf        = golf === true || golf === 'true';
  luxury      = luxury === true || luxury === 'true';
  meetgreet   = meetgreet === true || meetgreet === 'true';
  agree       = agree === true || agree === 'true';

  try {
    // Insert into the database
    const result = await pool.query(
      `INSERT INTO bookings(
        startdate, altdate, firstname, lastname, dob, citizenship, address,
        cell, recell, email, remail, program, schedule, instructor, room,
        extranight, duration, business, cultural, fiestas, gastronomic,
        golf, luxury, meetgreet, comment, company, bill, second, agree,
        residence, language, reservation_type
      ) VALUES(
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14, $15,
        $16, $17, $18, $19, $20, $21,
        $22, $23, $24, $25, $26, $27, $28,
        $29, $30, $31, $32
      ) RETURNING *`,
      [
        startdate, altdate, firstname, lastname, dob, citizenship, address,
        cell, recell, email, remail, program, schedule, instructor, room,
        extranight, duration, business, cultural, fiestas, gastronomic,
        golf, luxury, meetgreet, comment, company, bill, second, agree,
        residence, language, reservation_type
      ]
    );

    const booking = result.rows[0];

    // Build email body with booking details
    const mailBody = `
---- BOOKING ----
Start date: ${booking.startdate}
Alternative date: ${booking.altdate || 'N/A'}
First name: ${booking.firstname}
Last name: ${booking.lastname}
DOB: ${booking.dob || 'N/A'}
Citizenship: ${booking.citizenship || 'N/A'}
Address: ${booking.address || 'N/A'}
Email: ${booking.email}
Email (confirm): ${booking.remail || 'N/A'}
Mobile: ${booking.cell}
Mobile (confirm): ${booking.recell || 'N/A'}
Second guest: ${booking.second || 'N/A'}

Program: ${booking.program || 'N/A'}
Schedule: ${booking.schedule || 'N/A'}
Second instructor: ${booking.instructor || 'N/A'}
Room: ${booking.room || 'N/A'}
Extra night: ${booking.extranight ? 'Yes' : 'No'}
Duration: ${booking.duration || 'N/A'}

Experiences:
- Business: ${booking.business ? 'Yes' : 'No'}
- Cultural: ${booking.cultural ? 'Yes' : 'No'}
- Fiestas: ${booking.fiestas ? 'Yes' : 'No'}
- Gastronomic: ${booking.gastronomic ? 'Yes' : 'No'}
- Golf: ${booking.golf ? 'Yes' : 'No'}
- Luxury: ${booking.luxury ? 'Yes' : 'No'}

Premium services:
- Meet & greet: ${booking.meetgreet ? 'Yes' : 'No'}

Comment: ${booking.comment || 'N/A'}

Billing:
- Paid by: ${booking.bill || 'N/A'}
- Company: ${booking.company || 'N/A'}

Agree to T&C: ${booking.agree ? 'Yes' : 'No'}
Residence: ${booking.residence || 'N/A'}
Language: ${booking.language || 'N/A'}
Reservation type: ${booking.reservation_type}

Full name: ${booking.firstname} ${booking.lastname}
`;

    // Send email
    await transporter.sendMail({
      from: process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      to:   process.env.SMTP_USER || 'no-reply@anderslanguages.com',
      subject: getBookingSubject(booking.reservation_type),
      text: mailBody
    });

    res.status(201).json({
      message: 'Booking created successfully',
      data: booking
    });

  } catch (error) {
    console.error('Error in bookings.js:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
// This code defines an Express router for handling booking requests.