import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import routes from './src/routes/index.js';
import pool from './src/db.js';

dotenv.config();
const app = express();
const port = process.env.PORT || 3000;

// __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api', routes);
app.use(express.static(__dirname));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});
app.use((req, res) => res.status(404).send('Route not found'));

// Connection and start
async function start() {
  try {
    const conn = await pool.getConnection();
    conn.release();

    app.listen(port);
  } catch (err) {
    console.error('Error connecting to MySQL:', err);
    process.exit(1);
  }
}

start();
