import express from 'express';
import pool from '../db.js';
import { validateProposal } from '../middleware/validators.js';

const router = express.Router();

router.post('/', validateProposal, async (req, res) => {
  try {
    const { name, email, whatsapp, program, boletin } = req.body;

    const result = await pool.query(
      'INSERT INTO proposals (name, email, whatsapp, program, boletin) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, email, whatsapp, program, boletin]
    );

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error('❌ Error al guardar propuesta:', err);
    res.status(500).json({ success: false, message: 'Error al guardar la propuesta' });
  }
});

export default router;
