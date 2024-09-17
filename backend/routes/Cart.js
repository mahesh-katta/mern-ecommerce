const express = require('express');
const Cart = require('../models/Cart');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken'); // Import the middleware

// Get the Cart
router.get('/cart', verifyToken, async (req, res) => {
    try {
        const cart = await Cart.findOne({ customerId: req.customer.id }).populate('items.productId');
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add to Cart
router.post('/addtoC', verifyToken, async (req, res) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ customerId: req.customer.id });
        if (!cart) {
            cart = new Cart({ customerId: req.customer.id, items: [] });
        }

        const existingItem = cart.items.find(item => item.productId.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity; // Update quantity
        } else {
            cart.items.push({ productId, quantity }); // Add new item
        }

        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error adding to cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove from Cart
router.post('/removefromC', verifyToken, async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ customerId: req.customer.id });
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.productId.toString() !== productId);
        await cart.save();
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error removing from cart:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;