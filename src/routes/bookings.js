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

function getBookingSubject(type) {
  switch (type) {
    case 'reservations-spain':
      return '**EN* BOOKING SEVILLA *** Spanish immersion: your booking';
    case 'reservations-mexico':
      return '**EN* BOOKING CUERNAVACA *** Spanish immersion: your booking';
    case 'specials-all':
      return '**EN* BOOKING SPECIALS ALL *** Spanish immersion: your reservation';
    case 'specials-sev':
      return '**EN* BOOKING SPECIALS SEV *** Spaanse immersion: your reservation';
    default:
      return '**EN* BOOKING *** Spanish immersion: your booking';
  }
}

router.post('/', async (req, res) => {
  const {
    startdate, altdate, firstname, lastname, dob,
    citizenship, address, cell, recell, email, remail,
    program, schedule, instructor, room, extranight,
    duration, business, cultural, fiestas, gastronomic,
    golf, luxury, meetgreet, comment, company, bill,
    second, agree, residence, language, reservation_type
  } = req.body;

  if (!firstname || !lastname || !email || !reservation_type || !startdate) {
    return res.status(400).json({ error: 'Required fields must be provided' });
  }

  try {
    const placeholders = Array(32).fill('?').join(', ');
    const values = [
      startdate, altdate, firstname, lastname, dob, citizenship, address,
      cell, recell, email, remail, program, schedule, instructor, room,
      extranight, duration, business, cultural, fiestas, gastronomic,
      golf, luxury, meetgreet, comment, company, bill, second, agree,
      residence, language, reservation_type
    ];

    const [insertResult] = await pool.query(
      `INSERT INTO bookings (
        startdate, altdate, firstname, lastname, dob, citizenship, address,
        cell, recell, email, remail, program, schedule, instructor, room,
        extranight, duration, business, cultural, fiestas, gastronomic,
        golf, luxury, meetgreet, comment, company, bill, second, agree,
        residence, language, reservation_type
      ) VALUES (${placeholders})`,
      values
    );

    const [rows] = await pool.query(
      'SELECT * FROM bookings WHERE id = ?',
      [insertResult.insertId]
    );
    const booking = rows[0];

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
Instructor: ${booking.instructor || 'N/A'}
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
`;

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
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
