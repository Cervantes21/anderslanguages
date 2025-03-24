-- Tabla: bookings
CREATE TABLE IF NOT EXISTS bookings (
  id SERIAL PRIMARY KEY,
  startdate DATE NOT NULL,
  altdate DATE,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  dob DATE,
  citizenship TEXT,
  address TEXT,
  cell TEXT,
  recell TEXT,
  email TEXT NOT NULL,
  remail TEXT,
  program TEXT,
  schedule TEXT,
  instructor TEXT,
  room TEXT,
  extranight BOOLEAN,
  duration TEXT,
  business BOOLEAN,
  cultural BOOLEAN,
  fiestas BOOLEAN,
  gastronomic BOOLEAN,
  golf BOOLEAN,
  luxury BOOLEAN,
  meetgreet BOOLEAN,
  comment TEXT,
  company TEXT,
  bill TEXT,
  second TEXT,
  agree BOOLEAN,
  residence TEXT,
  language TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: newsletters
CREATE TABLE IF NOT EXISTS newsletters (
  id SERIAL PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: proposals
CREATE TABLE IF NOT EXISTS proposals (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  program TEXT,
  boletin BOOLEAN,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabla: contacts (formulario general)
CREATE TABLE IF NOT EXISTS contacts (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
