import express from 'express';
import pool from '../db.js';

const router = express.Router();

// Endpoint para agregar una dirección de correo al newsletter
router.post('/', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ success: false, error: 'Email es requerido' });
  }

  try {
    // Insertar en la base de datos
    const result = await pool.query(
      'INSERT INTO newsletters(email) VALUES($1) RETURNING *',
      [email]
    );

    // Responder con éxito sin texto duplicado
    return res.status(201).json({
      success: true,
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error al insertar en la base de datos:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

// Endpoint para obtener todos los correos del newsletter
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM newsletters');
    return res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (error) {
    console.error('Error al obtener datos de la base de datos:', error);
    return res.status(500).json({ success: false, error: 'Error interno del servidor' });
  }
});

export default router;
