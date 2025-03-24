/**
* PHP Email Form Validation - Custom Version
*/

(function () {
  "use strict";

  let forms = document.querySelectorAll('.php-email-form');

  forms.forEach(function (e) {
    e.addEventListener('submit', function (event) {
      event.preventDefault();

      const thisForm = this;
      const action = thisForm.getAttribute('action');

      if (!action) {
        displayError(thisForm, 'The form action property is not set!');
        return;
      }

      thisForm.querySelector('.loading')?.classList.add('d-block');
      thisForm.querySelector('.error-message')?.classList.remove('d-block');
      thisForm.querySelector('.sent-message')?.classList.remove('d-block');

      const formData = new FormData(thisForm);
      const jsonData = {};
      formData.forEach((value, key) => {
        jsonData[key] = value;
      });

      fetch(action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(jsonData)
      })
        .then(response => response.json())
        .then(data => {
          thisForm.querySelector('.loading')?.classList.remove('d-block');
          if (data.success) {
            thisForm.querySelector('.sent-message')?.classList.add('d-block');
            thisForm.reset();
          } else {
            const errorMsg = data.message || 'Error al enviar el formulario.';
            displayError(thisForm, errorMsg);
          }
        })
        .catch(error => {
          thisForm.querySelector('.loading')?.classList.remove('d-block');
          displayError(thisForm, error.message || 'Error al enviar el formulario.');
        });
    });
  });

  function displayError(form, error) {
    const errorContainer = form.querySelector('.error-message');
    if (errorContainer) {
      errorContainer.innerHTML = error;
      errorContainer.classList.add('d-block');
    }
  }
})();
