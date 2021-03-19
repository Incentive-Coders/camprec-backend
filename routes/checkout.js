const stripe = require('stripe')('sk_test_51IVziGIyZFM8agXo9ep6CGhRhX23tM7RCwT2axl6JYKXJMlrOCGaZC0s5XymBOVqsdfmIrjh83PGIiz1G67yDZit009GuW6cJY');
const express = require("express");
const router = express.Router();
const YOUR_DOMAIN = 'https://camprec.herokuapp.com/api/checkout';
router.post('/checkout', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Stubborn Attachments',
            images: ['https://i.imgur.com/EHyR2nP.png'],
          },
          unit_amount: 2000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${YOUR_DOMAIN}?success=true`,
    cancel_url: `${YOUR_DOMAIN}?canceled=true`,
  });
  res.json({ id: session.id });
});

module.exports = router;