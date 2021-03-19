const express = require("express");
const router = express.Router();
const stripe = require("stripe")(process.env.STRIPE_SECRET_TEST);
const { check } = require('express-validator');


router.post(
    '/payment', 
[
    check('amount','amount is required').not().isEmpty(),
    check('id','id is required').not().isEmpty(),
],
async (req, res) => {
    
	let { amount, id } = req.body
	try {
		const payment = await stripe.paymentIntents.create({
			amount,
			currency: "USD",
			description: "Camprec Premium",
			payment_method: id,
			confirm: true
		})
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
});

module.exports = router;