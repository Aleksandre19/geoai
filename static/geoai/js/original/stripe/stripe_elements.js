let stripe_public_key = document.getElementById('id_stripe_publc_key')
    .textContent.slice(1, -1);

let stripe_client_secret_key = document.getElementById('id_stripe_client_secret_key')
    .textContent.slice(1, -1);

const stripe = Stripe(stripe_public_key);
const elements = stripe.elements();
const card = elements.create('card');
card.mount('#stripe-elements-div');
