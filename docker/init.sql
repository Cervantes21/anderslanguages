-- docker/init.sql
-- Tabla: bookings
CREATE TABLE IF NOT EXISTS bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
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
  reservation_type TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: newsletters
CREATE TABLE IF NOT EXISTS newsletters (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: proposals
CREATE TABLE IF NOT EXISTS proposals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT,
  program TEXT,
  boletin BOOLEAN,
  proposal_type TEXT NOT NULL,
  residence TEXT,
  language TEXT,
  duration TEXT,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Tabla: contacts (formulario general)
CREATE TABLE IF NOT EXISTS contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
