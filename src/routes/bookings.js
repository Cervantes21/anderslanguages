import express from 'express';
import pool from '../db.js';
import { validateBooking } from '../middleware/validators.js';

const router = express.Router();

// Crear una reserva
router.post('/', validateBooking, async (req, res) => {
  try {
    const {
      startdate, altdate, firstname, lastname, dob, citizenship, address,
      cell, recell, email, remail, program, schedule, instructor,
      room, extranight, duration, business, cultural, fiestas,
      gastronomic, golf, luxury, meetgreet, comment, company,
      bill, second, agree, residence, language
    } = req.body;

    const result = await pool.query(
      `INSERT INTO bookings (
        startdate, altdate, firstname, lastname, dob, citizenship, address,
        cell, recell, email, remail, program, schedule, instructor,
        room, extranight, duration, business, cultural, fiestas,
        gastronomic, golf, luxury, meetgreet, comment, company,
        bill, second, agree, residence, language
      ) VALUES (
        $1, $2, $3, $4, $5, $6, $7,
        $8, $9, $10, $11, $12, $13, $14,
        $15, $16, $17, $18, $19, $20,
        $21, $22, $23, $24, $25, $26,
        $27, $28, $29, $30, $31
      ) RETURNING *`,
      [
        startdate, altdate, firstname, lastname, dob, citizenship, address,
        cell, recell, email, remail, program, schedule, instructor,
        room, extranight, duration, business, cultural, fiestas,
        gastronomic, golf, luxury, meetgreet, comment, company,
        bill, second, agree, residence, language
      ]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error('❌ Error al guardar booking:', error);
    res.status(500).json({ success: false, message: 'Error al guardar la reserva' });
  }
});

export default router;
