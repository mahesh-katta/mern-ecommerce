const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Customer = require('../models/Customer');
const Cart = require('../models/Cart');
const Wishlist = require('../models/Wishlist');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Import the middleware

// Sign Up Endpoint
router.post('/signup', async (req, res) => {
    const { name, phone, email, password } = req.body;
    try {
        const existingCustomer = await Customer.findOne({ $or: [{ phone }, { email }] });
        if (existingCustomer) {
            return res.status(400).json({ message: 'Phone number or email already exists' });
        }

        const customer = new Customer({ name, phone, email, password });
        await customer.save();

        res.status(201).json({ id: customer.id, name: customer.name, phone: customer.phone, email: customer.email });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Login Endpoint
router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    try {
        const customer = await Customer.findOne({ email });
        if (!customer || !(await customer.comparePassword(password))) {
            return res.status(400).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: customer._id, email: customer.email }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Check if cart exists
        let cart = await Cart.findOne({ customerId: customer._id });
        if (!cart) {
            cart = new Cart({ customerId: customer._id, items: [] });
            await cart.save();
        }

        // Check if wishlist exists
        let wishlist = await Wishlist.findOne({ customerId: customer._id });
        if (!wishlist) {
            wishlist = new Wishlist({ customerId: customer._id, items: [] });
            await wishlist.save();
        }

        res.status(200).json({
            token,
            customer: { id: customer._id, name: customer.name },
            cart,
            wishlist
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;