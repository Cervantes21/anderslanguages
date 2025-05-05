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

// Obtain __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json()); // Necessary to parse JSON bodies

// Register API routes
app.use('/api', routes);

// Serve static files from the project root
app.use(express.static(__dirname));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Fallback route for when no other route is found
app.use((req, res) => {
  res.status(404).send('Route not found');
});

// Connect to the database and start the server
pool.connect()
  .then(() => {
    console.info('Connected to PostgreSQL');

    app.listen(port, () => {
      console.info(`Server listening on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('Error connecting to PostgreSQL:', err);
    process.exit(1);
  });
