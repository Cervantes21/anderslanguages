import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Endpoint to add an email address to the newsletter
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email is required' });
  }

  try {
    // Insert into the newsletters table
    const result = await pool.query(
      'INSERT INTO newsletters(email) VALUES($1) RETURNING *',
      [email]
    );

    const newEntry = result.rows[0];
    console.info('Newsletter signup saved:', newEntry.email);

    // Respond with the newly created entry
    return res.status(201).json({
      success: true,
      data: newEntry
    });
  } catch (error) {
    console.error('Error inserting newsletter email:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// Endpoint to fetch all newsletter subscriber emails
router.get('/', async (req, res) => {
  try {
    // Retrieve all entries from the newsletters table
    const result = await pool.query('SELECT * FROM newsletters');
    console.info(`Fetched ${result.rows.length} newsletter entries`);

    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error fetching newsletter entries:', error);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

export default router;
