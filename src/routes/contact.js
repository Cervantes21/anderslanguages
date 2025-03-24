import express from 'express';
import pool from '../db.js';
import { validateContact } from '../middleware/validators.js';

const router = express.Router();

router.post('/', validateContact, async (req, res) => {
  try {
    const { name, email, message } = req.body;

    const result = await pool.query(
      'INSERT INTO contacts (name, email, message) VALUES ($1, $2, $3) RETURNING *',
      [name, email, message]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al guardar contacto:', err);
    res.status(500).json({ success: false, message: 'Error al guardar el mensaje' });
  }
});

export default router;
