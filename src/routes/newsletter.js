import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Create a new newsletter subscription
router.post('/', async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    // Insert into MySQL
    const [insertResult] = await pool.query(
      'INSERT INTO newsletters(email) VALUES (?)',
      [email]
    );

    // Retrieve the new entry
    const [rows] = await pool.query(
      'SELECT * FROM newsletters WHERE id = ?',
      [insertResult.insertId]
    );
    const newEntry = rows[0];

    return res.status(201).json({ success: true, data: newEntry });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Fetch all newsletter subscriber emails
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM newsletters');
    return res.status(200).json({ success: true, data: rows });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
