// Middleware de validación
export function validateRequiredFields(fields) {
  return (req, res, next) => {
    const missing = [];
    const invalids = [];

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    fields.forEach((field) => {
      const value = req.body[field];
      if (value === undefined || value === null || value === '') {
        missing.push(field);
      } else if (field === 'email' && !emailRegex.test(value)) {
        invalids.push(field);
      } else if (field === 'dob' && isNaN(Date.parse(value))) {
        invalids.push(field);
      }
    });

    if (missing.length > 0 || invalids.length > 0) {
      return res.status(400).json({
        success: false,
        errorCode: 'VALIDATION_ERROR',
        message: 'Errores de validación',
        missingFields: missing.length ? missing : undefined,
        invalidFields: invalids.length ? invalids : undefined,
      });
    }

    next();
  };
}

// Middleware específico para el formulario de contacto
export const validateContact = validateRequiredFields(['name', 'email', 'message']);

// Middleware específico para newsletter
export const validateNewsletter = validateRequiredFields(['email']);

// Middleware específico para propuestas
export const validateProposal = validateRequiredFields(['name', 'email']);

// Middleware específico para reservas
export const validateBooking = validateRequiredFields(['firstname', 'email', 'startdate']);
