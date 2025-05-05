/**
 * PHP Email Form Validation + Redirect
 */
(function () {
  "use strict";

  // Returns the thank-you page URL based on the form’s data-type
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

  // Select all forms with the .php-email-form class
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

      // Show the loading spinner, hide any previous messages
      thisForm.querySelector('.loading')?.classList.add('d-block');
      thisForm.querySelector('.error-message')?.classList.remove('d-block');
      thisForm.querySelector('.sent-message')?.classList.remove('d-block');

      // Gather form data into an object
      const formData = new FormData(thisForm);
      const jsonData = {};
      formData.forEach((value, key) => {
        // Convert checkbox to boolean
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

        // Hide the loading spinner
        thisForm.querySelector('.loading')?.classList.remove('d-block');

        // Attempt to parse JSON, even if the response indicates an error
        let data = {};
        try {
          data = await response.json();
        } catch {}

        if (response.ok && !data.error) {
          // Success: show sent message, reset the form
          thisForm.querySelector('.sent-message')?.classList.add('d-block');
          thisForm.reset();

          // Redirect after 1.5 seconds
          const type = thisForm.dataset.type;
          if (type) {
            setTimeout(() => {
              window.location.href = getRedirectUrl(type);
            }, 1500);
          }
        } else {
          const msg = data.error || data.message || 'Error sending the form.';
          displayError(thisForm, msg);
        }
      } catch (error) {
        // Hide spinner and display error
        thisForm.querySelector('.loading')?.classList.remove('d-block');
        displayError(thisForm, error.message || 'Error sending the form.');
      }
    });
  });

  /**
   * Displays an error message in the form
   * @param {HTMLFormElement} form 
   * @param {string} error 
   */
  function displayError(form, error) {
    const err = form.querySelector('.error-message');
    if (err) {
      err.innerHTML = error;
      err.classList.add('d-block');
    }
  }
})();
