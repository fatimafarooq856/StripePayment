'use strict';

var stripe = Stripe('pk_test_RtAlMhhfJ7xrGKco8l5mjDPX00ZjKy9Sbm');

function registerElements(elements, exampleName) {
  var formClass = '.' + exampleName;
  var example = document.querySelector(formClass);

  var form = example.querySelector('form');
  var resetButton = example.querySelector('a.reset');
  var error = form.querySelector('.error');
  var errorMessage = error.querySelector('.message');

  function enableInputs() {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        "input[type='text'], input[type='email'], input[type='tel']"
      ),
      function(input) {
        input.removeAttribute('disabled');
      }
    );
  }

  function disableInputs() {
    Array.prototype.forEach.call(
      form.querySelectorAll(
        "input[type='text'], input[type='email'], input[type='tel']"
      ),
      function(input) {
        input.setAttribute('disabled', 'true');
      }
    );
  }

  function triggerBrowserValidation() {
    // The only way to trigger HTML5 form validation UI is to fake a user submit
    // event.
    var submit = document.createElement('input');
    submit.type = 'submit';
    submit.style.display = 'none';
    form.appendChild(submit);
    submit.click();
    submit.remove();
  }

  // Listen for errors from each Element, and show error messages in the UI.
  var savedErrors = {};
  elements.forEach(function(element, idx) {
    element.on('change', function(event) {
      if (event.error) {
        error.classList.add('visible');
        savedErrors[idx] = event.error.message;
        errorMessage.innerText = event.error.message;
      } else {
        savedErrors[idx] = null;

        // Loop over the saved errors and find the first one, if any.
        var nextError = Object.keys(savedErrors)
          .sort()
          .reduce(function(maybeFoundError, key) {
            return maybeFoundError || savedErrors[key];
          }, null);

        if (nextError) {
          // Now that they've fixed the current error, show another one.
          errorMessage.innerText = nextError;
        } else {
          // The user fixed the last error; no more errors.
          error.classList.remove('visible');
        }
      }
    });
  });

  // Listen on the form's 'submit' handler...
  form.addEventListener('submit', function(e) {
    e.preventDefault();

    // Trigger HTML5 validation UI on the form if any of the inputs fail
    // validation.
    var plainInputsValid = true;
    Array.prototype.forEach.call(form.querySelectorAll('input'), function(
      input
    ) {
      if (input.checkValidity && !input.checkValidity()) {
        plainInputsValid = false;
        return;
      }
    });
    if (!plainInputsValid) {
      triggerBrowserValidation();
      return;
    }

    // Show a loading screen...
    example.classList.add('submitting');

    // Disable all inputs.
    disableInputs();

    // Gather additional customer data we may have collected in our form.
      var firstname = form.querySelector('#' + exampleName + '-firstname');
      var lastname = form.querySelector('#' + exampleName + '-lastname');
      
      debugger
      var Shippingaddress1 = form.querySelector('#' + exampleName + '-Shippingaddress');
      var city = form.querySelector('#' + exampleName + '-Shippingcity');
      var state = form.querySelector('#' + exampleName + '-Shippingstate');
      var zip = form.querySelector('#' + exampleName + '-Shippingzip');
      var country = form.querySelector('#' + exampleName + '-Shippingcountry');
    
      var Billingaddress1 = form.querySelector('#' + exampleName + '-Billingaddress');
      //var Billingcity = form.querySelector('#' + exampleName + '-Billingcity');
      //var Billingstate = form.querySelector('#' + exampleName + '-Billingstate');
      //var Billingzip = form.querySelector('#' + exampleName + '-Billingzip');

      var additionalData = {
        
      
        name:  firstname.value  + " " +  lastname.value ,
        address_line1: Shippingaddress1 ? Shippingaddress1.value : undefined,
        address_line2: Billingaddress1 ? Billingaddress1.value : undefined,
              
       
        //Billingaddress_line1: Billingaddress1 ? Billingaddress1.value : undefined,
        address_city: city ? city.value : undefined,
        address_state: state ? state.value : undefined,
          address_zip: zip ? zip.value : undefined,
          address_country: country ? country.value:undefined,
    };

    // Use Stripe.js to create a token. We only need to pass in one Element
    // from the Element group in order to create a token. We can also pass
    // in the additional customer data we collected in our form.
    stripe.createToken(elements[0], additionalData).then(function(result) {
      // Stop loading!
      example.classList.remove('submitting');
        debugger
      if (result.token) {         
        // If we received a token, show the token ID.
        example.querySelector('.token').innerText = result.token.id;
        example.classList.add('submitted');
      } else {
        // Otherwise, un-disable inputs.
        enableInputs();
      }
    });
  });

  resetButton.addEventListener('click', function(e) {
    e.preventDefault();
    // Resetting the form (instead of setting the value to `''` for each input)
    // helps us clear webkit autofill styles.
    form.reset();

    // Clear each Element.
    elements.forEach(function(element) {
      element.clear();
    });

    // Reset error state as well.
    error.classList.remove('visible');

    // Resetting the form does not un-disable inputs, so we need to do it separately:
    enableInputs();
    example.classList.remove('submitted');
  });
}
