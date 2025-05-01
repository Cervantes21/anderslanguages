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
app.use(express.json()); // Necesario para procesar cuerpos JSON

// Registrar rutas API
app.use('/api', routes);

// Servir archivos estáticos desde la raíz del proyecto
app.use(express.static(__dirname));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Ruta fallback para cuando no se encuentra ninguna otra ruta
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// Conexión a la base de datos y arranque del servidor
pool.connect()
  .then(() => {
    console.log('✅ Conectado a PostgreSQL');

    app.listen(port, () => {
      console.log(`🚀 Servidor escuchando en http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error('❌ Error al conectar a PostgreSQL:', err);
    process.exit(1);
  });
