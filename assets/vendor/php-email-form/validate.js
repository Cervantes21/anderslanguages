/**
 * PHP Email Form Validation + Redirect
 */
(function () {
  "use strict";

  // Devuelve la URL de gracias según el data-type
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
      default:
        return '/en/thankyou-alertservice.html';
    }
  }

  // Selecciona todos los formularios
  const forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (form) {
    form.addEventListener('submit', async function (event) {
      event.preventDefault();
      const thisForm = form;
      const action = thisForm.getAttribute('action');
      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      // Muestra el spinner, oculta mensajes previos
      thisForm.querySelector('.loading')?.classList.add('d-block');
      thisForm.querySelector('.error-message')?.classList.remove('d-block');
      thisForm.querySelector('.sent-message')?.classList.remove('d-block');

      // Recopila datos
      const formData = new FormData(thisForm);
      const jsonData = {};
      formData.forEach((value, key) => {
        // checkbox → boolean
        const el = thisForm.elements[key];
        if (el && el.type === 'checkbox') {
          jsonData[key] = el.checked;
        } else {
          jsonData[key] = value;
        }
      });

      try {
        const response = await fetch(action, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Requested-With': 'XMLHttpRequest'
          },
          body: JSON.stringify(jsonData)
        });

        // Oculta spinner
        thisForm.querySelector('.loading')?.classList.remove('d-block');

        // Intenta parsear JSON incluso en error
        let data = {};
        try { data = await response.json(); } catch {}

        if (response.ok && !data.error) {
          // Éxito
          thisForm.querySelector('.sent-message')?.classList.add('d-block');
          thisForm.reset();

          // Redirección tras 1.5s
          const type = thisForm.dataset.type;
          if (type) {
            setTimeout(() => {
              window.location.href = getRedirectUrl(type);
            }, 1500);
          }
        } else {
          const msg = data.error || data.message || 'Error al enviar el formulario.';
          displayError(thisForm, msg);
        }
      } catch (error) {
        thisForm.querySelector('.loading')?.classList.remove('d-block');
        displayError(thisForm, error.message || 'Error al enviar el formulario.');
      }
    });
  });

  function displayError(form, error) {
    const err = form.querySelector('.error-message');
    if (err) {
      err.innerHTML = error;
      err.classList.add('d-block');
    }
  }
})();
