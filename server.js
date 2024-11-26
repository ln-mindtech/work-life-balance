const express = require('express');
require('dotenv').config();
const path = require('path');
const stripe = require('stripe')(process.env.STRIPE_SECRET); // Stripe secret key

const app = express();
const port = process.env.PORT || 3003;

// Middleware to serve static files (HTML, CSS, JavaScript, images, etc.)
app.use(express.static(path.join(__dirname, 'public')));

// Parse JSON bodies for POST requests
app.use(express.json());
console.log(`Server running on port ${port}`);
// Example of an API route (e.g., for creating a PaymentIntent with Stripe)
app.post('/v1/payment_intents', async (req, res) => {
    const { email } = req.body;
    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 3740, // e.g., amount in smallest currency unit (cents)
            currency: 'usd',
            // receipt_email: email, // Add email to receipt
            metadata: { email: email, course: "work/life" }, // Optionally store email in metadata
            // In the latest version of the API, specifying the `automatic_payment_methods` parameter is optional because Stripe enables its functionality by default.
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.send({
            clientSecret: paymentIntent.client_secret,
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
});



// Listen on the specified port
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});