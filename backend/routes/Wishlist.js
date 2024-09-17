const express = require('express');
const Wishlist = require('../models/Wishlist');
const verifyToken = require('../middleware/verifyToken'); // Import the middleware
const router = express.Router();

// Get Wishlist
router.get('/wishlist', verifyToken, async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({ customerId: req.customer.id }).populate('items.productId');
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error fetching wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Add to Wishlist
router.post('/addtoW', verifyToken, async (req, res) => {
    const { productId } = req.body;
    try {
        let wishlist = await Wishlist.findOne({ customerId: req.customer.id });
        if (!wishlist) {
            wishlist = new Wishlist({ customerId: req.customer.id, items: [] });
        }

        // Avoid duplicates
        if (!wishlist.items.some(item => item.productId.toString() === productId)) {
            wishlist.items.push({ productId });
        }

        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error adding to wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Remove from Wishlist
router.post('/removefromW', verifyToken, async (req, res) => {
    const { productId } = req.body;
    try {
        const wishlist = await Wishlist.findOne({ customerId: req.customer.id });
        if (!wishlist) {
            return res.status(404).json({ message: 'Wishlist not found' });
        }

        wishlist.items = wishlist.items.filter(item => item.productId.toString() !== productId);
        await wishlist.save();
        res.status(200).json(wishlist);
    } catch (error) {
        console.error('Error removing from wishlist:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;