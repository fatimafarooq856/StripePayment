
var stripe = Stripe('pk_test_RtAlMhhfJ7xrGKco8l5mjDPX00ZjKy9Sbm');

// Create an instance of Elements.
var elements = stripe.elements();

// Custom styling can be passed to options when creating an Element.
// (Note that this demo uses a wider set of styles than the guide below.)
var style = {
    base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
            color: '#aab7c4'
        }
    },
    invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
    }
};

// Create an instance of the card Element.
var card = elements.create("card", { style: style });
card.mount("#card-element");

// Handle real-time validation errors from the card Element.
card.addEventListener('change', function (event) {
    var displayError = document.getElementById('card-errors');
    if (event.error) {
        displayError.textContent = event.error.message;
    } else {
        displayError.textContent = '';
    }
});
var paymentRequest = stripe.paymentRequest({
    country: 'US',
    currency: 'usd',
    total: {
        label: 'Demo total',
        amount: 1000,
    },
    requestPayerName: true,
    requestPayerEmail: true,
});


// Handle form submission.
//var form = document.getElementById('payment-form');
//form.addEventListener('submit', function (event) {
//    event.preventDefault();

//    stripe.createToken(card).then(function (result) {
//        if (result.error) {
//            // Inform the user if there was an error.
//            var errorElement = document.getElementById('card-errors');
//            errorElement.textContent = result.error.message;
//        } else {
//            // Send the token to your server.
//            stripeTokenHandler(result.token);
//        }
//    });
//});

// Submit the form with the token ID.
function stripeTokenHandler(token) {
    // Insert the token ID into the form so it gets submitted to the server
    var form = document.getElementById('payment-form');
    var hiddenInput = document.createElement('input');
    hiddenInput.setAttribute('type', 'hidden');
    hiddenInput.setAttribute('name', 'stripeToken');
    hiddenInput.setAttribute('value', token.id);
    form.appendChild(hiddenInput);
    StripeConfiguration.ApiKey = "sk_test_sYOGH6H5P28clzl4dSBHrdL400XDO9XHIJ";

    var paymentIntentService = new PaymentIntentService();
    var createOptions = new PaymentIntentCreateOptions
    {
        Amount = 1000,
            Currency = "usd",
            ReceiptEmail = "jenny.rosen@example.com",
            PaymentMethodTypes = new List < string > "card"

    };
    paymentIntentService.Create(createOptions);
    // Submit the form
    //form.submit();
}
var submitButton = document.getElementById('submit');

submitButton.addEventListener('click', function (ev) {
    stripe.createToken(card).then(function (result) {
        if (result.error) {
            // Inform the user if there was an error.
            var errorElement = document.getElementById('card-errors');
            errorElement.textContent = result.error.message;
        } else {
            // Send the token to your server.
            stripeTokenHandler(result.token);
        }
    });
    stripe.confirmCardPayment("sk_test_sYOGH6H5P28clzl4dSBHrdL400XDO9XHIJ", {
        payment_method: {
            card: card,
            billing_details: {
                name: 'Jenny Rosen'
            }
        }
    }).then(function (result) {
        if (result.error) {
            console.log(result.error.message);
        } else {
            // The payment has been processed!
            if (result.paymentIntent.status === 'succeeded') {
                console.log('succeeded');
                // Show a success message to your customer
                // There's a risk of the customer closing the window before callback
                // execution. Set up a webhook or plugin to listen for the
                // payment_intent.succeeded event that handles any business critical
                // post-payment actions.
            }
        }
    });
});