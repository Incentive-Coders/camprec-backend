const stripe = require('stripe')('sk_test_51IVziGIyZFM8agXo9ep6CGhRhX23tM7RCwT2axl6JYKXJMlrOCGaZC0s5XymBOVqsdfmIrjh83PGIiz1G67yDZit009GuW6cJY');
const express = require("express");
const router = express.Router();
router.post("/payment", async (req, res) => {
	let { amount, id} = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "INR",
			description: "Camprec",
			payment_method: id,
			confirm: true
		});
		console.log("Payment", payment)
		res.json({
			message: "Payment successful",
			success: true
		})
	} catch (error) {
		console.log("Error", error)
		res.json({
			message: "Payment failed",
			success: false
		})
	}
})

module.exports = router;