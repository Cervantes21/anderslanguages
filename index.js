// index.js
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

// Obtener __dirname en módulos ES
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(cors());
app.use(express.json());

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname));

// Ruta principal: servir index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Verificar conexión a la base de datos y arrancar servidor
pool.connect()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');

    // Registrar rutas API
    app.use('/api', routes);

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a PostgreSQL:', err);
    process.exit(1);
  });
