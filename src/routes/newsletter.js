import express from 'express';
import pool from '../db.js';
import { validateNewsletter } from '../middleware/validators.js';

const router = express.Router();

router.post('/', validateNewsletter, async (req, res) => {
  try {
    const { email } = req.body;

    const result = await pool.query(
      'INSERT INTO newsletters (email) VALUES ($1) RETURNING *',
      [email]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al guardar newsletter:', err);
    res.status(500).json({ success: false, message: 'Error al guardar el email' });
  }
});

export default router;
