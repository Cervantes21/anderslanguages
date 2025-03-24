import express from 'express';

// Importación de rutas modulares
import bookings from './bookings.js';
import newsletter from './newsletter.js';
import proposals from './proposals.js';
import contact from './contact.js';

const router = express.Router();

// Asociación de rutas a sus endpoints
router.use('/bookings', bookings);
router.use('/newsletter', newsletter);
router.use('/proposals', proposals);
router.use('/contact', contact);

export default router;
