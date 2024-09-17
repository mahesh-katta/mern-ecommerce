const express = require('express');
const Product = require('../models/Product');
const router = express.Router();

// Get all products
router.get('/products', async (req, res) => { // Changed from '/product' to '/products'
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Get product by ID
router.get('/products/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const product = await Product.findOne({productId: id}); 
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Filter products
router.get('/products/filter', async (req, res) => {
    const { category, color, minPrice, maxPrice, minDiscount } = req.query;

    const query = {};
    if (category) { query.category = category; }
    if (color) { query.color = color; }
    if (minPrice) { query.price = { $gte: minPrice }; }
    if (maxPrice) { query.price = { ...query.price, $lte: maxPrice }; }
    if (minDiscount) { query.discount = { $gte: minDiscount }; }

    try {
        const products = await Product.find(query);
        if (products.length === 0) {
            return res.status(404).json({ message: 'No products found matching the criteria' });
        }
        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products by filters:', error);
        res.status(500).json({ message: 'Internal server error', error: error.message });
    }
});

// Create a new product (admin route)
router.post('/products', async (req, res) => { // Changed to '/products' for consistency
    const { name, price, color, category, discount, description, stock } = req.body;
    try {
        const newProduct = new Product({ name, price, color, category, discount, description, stock });
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;