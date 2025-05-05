// assets/js/form-handler.js
// Este script gestiona el envío de todos los formularios con clase .php-email-form
// Para añadir nuevos destinos (p.ej. "reservations-paris"), sigue estos pasos:
// 1. En el HTML, añade data-type="reservations-paris" en el <form> correspondiente.
// 2. En generateSubject(), añade:
//      case 'reservations-paris':
//        return '**EN* BOOKING PARIS *** Spanish immersion: your booking';
// 3. En getRedirectUrl(), agrégalo al grupo de redirección:
//      case 'reservations-paris':
//        return '/en/thankyou-bookings.html';


document.addEventListener("DOMContentLoaded", () => {
  const forms = document.querySelectorAll('.php-email-form');

  forms.forEach(form => {
    const loading = form.querySelector('.loading');
    const sentMessage = form.querySelector('.sent-message');
    const errorMessage = form.querySelector('.error-message');

    // Tipo de formulario, debe coincidir con data-type en el HTML
    const type = form.dataset.type || 'alertservice';

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      // Honeypot anti-spam
      if (form.elements.url && form.elements.url.value) return;

      loading.style.display = 'block';
      sentMessage.style.display = 'none';
      if (errorMessage) errorMessage.style.display = 'none';

      const formData = new FormData(form);
      const data = {};
      formData.forEach((value, key) => {
        if (key === 'boletin') {
          data[key] = true;
        } else if (form.elements[key] && form.elements[key].type === 'checkbox') {
          data[key] = form.elements[key].checked;
        } else {
          data[key] = value;
        }
      });

      // Asignar subject dinámico según el tipo de formulario
      data.subject = generateSubject(type, data);

      try {
        const response = await fetch(form.action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });

        loading.style.display = 'none';

        if (response.ok) {
          sentMessage.style.display = 'block';
          form.reset();
          setTimeout(() => {
            window.location.href = getRedirectUrl(type);
          }, 1500);
        } else {
          const result = await response.json();
          if (errorMessage) {
            errorMessage.innerText = result.message || 'There was an error submitting the form.';
            errorMessage.style.display = 'block';
          }
        }
      } catch (err) {
        loading.style.display = 'none';
        if (errorMessage) {
          errorMessage.innerText = err.message || 'There was a problem submitting the form.';
          errorMessage.style.display = 'block';
        }
      }
    });
  });
});

function generateSubject(type, data) {
  switch (type) {
    case 'newsletter':
      return '**EN* NEWSLETTER *** Spanish immersion newsletter';
    case 'prices':
      return `**EN* PROPOSAL DIRECT *** Spanish Immersion for ${data.name || ''}`;
    case 'proposal-general':
      return `**EN* PROPOSAL PAGES *** Spanish Immersion for ${data.name || ''}`;
    case 'proposal-online':
      return `**EN* PROPOSAL ONLINE *** Spanish Immersion for ${data.name || ''}`;
    case 'proposal-ads':
      return `**EN* PROPOSAL ADS *** Spanish Immersion for ${data.name || ''}`;
    case 'proposal-specials':
      return `**EN* PROPOSAL SPECIALS *** Spanish Immersion for ${data.name || ''}`;
    case 'reservations-spain':
      return '**EN* BOOKING SEVILLA *** Spanish immersion: your booking';
    case 'reservations-mexico':
      return '**EN* BOOKING CUERNAVACA *** Spanish immersion: your booking';
    case 'specials-all':
      return '**EN* BOOKING SPECIALS ALL *** Spanish immersion: your reservation';
    case 'specials-sev':
      return '**EN* BOOKING SPECIALS SEV *** Spanish immersion: your reservation';
    default:
      return '**EN* ALERTSERVICE *** Spanish immersion alert service';
  }
}

function getRedirectUrl(type) {
  switch (type) {
    case 'newsletter':
      return '/en/thankyou-alertservice.html';
    case 'prices':
    case 'proposal-general':
    case 'proposal-online':
    case 'proposal-ads':
    case 'proposal-specials':
      return '/en/thankyou-prices.html';
    case 'reservations-spain':
    case 'reservations-mexico':
    case 'specials-all':
    case 'specials-sev':
      return '/en/thankyou-bookings.html';
  }
}
// Este script gestiona el envío de todos los formularios con clase .php-email-form