class GeoStripe {
    constructor() {
        this.stripe = Stripe(this.publicKey); // Initiate Stripe.
        this.stripeElement = this.stripe.elements(); // Create Stripe elements.
        this.card = this.stripeElement.create('card');  // Create card element.
        this.card.mount('#card-element'); // Mount card to div#card-element.
        this.cardValdation; // Card element realtime error valitator.
        this.submitCheckoutForm; // Submit checkout form.
    }

    get publicKey() {
        console.log(this.getElm('#id_stripe_publc_key'));
        return this.getElm('#id_stripe_publc_key').textContent.slice(1, -1);
    }

    get clientSecretKey() {
        return this.getElm('#id_stripe_client_secret_key').textContent.slice(1, -1);
    }

    // Grab the HTML element.
    getElm(attr) {
        return document.querySelector(attr);
    }

    // Handle realtime validation errors on the card element.
    get cardValdation() {
        this.card.addEventListener('change', (event) => {
            if (event.error) {
                const html = `
                    <span class="icon" role="alert">
                        <i class="fas fa-times"></i>
                    </span>
                    <span>${event.error.message}</span>
                `;
                this.getElm('#card-errors').innerHTML = html;
            } else {
                this.getElm('#card-errors').textContent = '';
            }
        });
    }

    get submitCheckoutForm() {
        this.getElm('#payment-form').addEventListener('submit', (event) => {
            event.preventDefault(); // Prevent default behaviour.
            // Desable card and submit button to avoid multiple payment request.
            this.card.update({'disabled': true });
            this.getElm('#payment-button').disabled = true; // Submit button.
            
            // Confirm Stripe card payment with client secret key.
            this.stripe.confirmCardPayment(this.clientSecretKey, {
                payment_method: {
                    card: this.card,
                }
            }).then((result) => {
                if (result.error) {
                    // Error message.
                    const html = `
                        <span class="icon" role="alert">
                        <i class="fas fa-times"></i>
                        </span>
                        <span>${result.error.message}</span>`;
                    // Append error message to the error div.
                    this.getElm('#card-errors').innerHTML = html;

                    // Enable card and submit button.
                    this.card.update({'disabled': false});
                    this.getElm('#payment-form').disabled = false;

                } else { // If there is no error, submit the form.
                    if (result.paymentIntent.status === 'succeeded') {
                        // Submit the payment form.
                        this.getElm('#payment-form').submit();
                    }
                }
            });  

        });
    }
}

new GeoStripe();



// let stripePublicKey = document.getElementById('id_stripe_publc_key')
//     .textContent.slice(1, -1);
    

// let stripeClientSecretKey = document.getElementById('id_stripe_client_secret_key')
//     .textContent.slice(1, -1);



// const stripe = Stripe(stripePublicKey);
// const elements = stripe.elements();

// const style = {
//    style: {
//     base: {
//       iconColor: '#c4f0ff',
//       color: '#fff',
//       fontWeight: '500',
//       fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
//       fontSize: '16px',
//       fontSmoothing: 'antialiased',
//       ':-webkit-autofill': {
//         color: '#fce883',
//       },
//       '::placeholder': {
//         color: '#87BBFD',
//       },
//     },
//     invalid: {
//       iconColor: '#FFC7EE',
//       color: '#FFC7EE',
//     },
//   },
// };

// const card = elements.create('card');
// card.mount('#card-element');

// // Handle realtime validation errors on the card element
// card.addEventListener('change', function (event) {
//     var errorDiv = document.getElementById('card-errors');
//     if (event.error) {
//         var html = `
//             <span class="icon" role="alert">
//                 <i class="fas fa-times"></i>
//             </span>
//             <span>${event.error.message}</span>
//         `;
//         errorDiv.innerHTML = html;
//     } else {
//         errorDiv.textContent = '';
//     }
// });


// // Grab the payment form.
// const form = document.getElementById('payment-form');

// form.addEventListener('submit', function (ev) {
    
//     ev.preventDefault();

//     // Desable card and submit button to avoid multiple payment request.
//     card.update({'disabled': true });
//     paymentButton = document.getElementById('payment-button');
//     paymentButton.disabled = true;
 
//     stripe.confirmCardPayment(stripeClientSecretKey, {
//         payment_method: {
//             card: card,
//         }
//     }).then(function(result) {
//         if (result.error) {
//             // Error message div.
//             const errorDiv = document.getElementById('card-errors');
//             // Error message.
//             const html = `
//                 <span class="icon" role="alert">
//                 <i class="fas fa-times"></i>
//                 </span>
//                 <span>${result.error.message}</span>`;
//             // Append error message to the error div.
//             errorDiv.innerHTML = html;

//             // Enable card and submit button.
//             card.update({'disabled': false});
//             paymentButton.disabled = false;

//         } else { // If there is no error, submit the form.
//             if (result.paymentIntent.status === 'succeeded') {
//                 form.submit();
//             }
//         }
//     });        
    
// });
