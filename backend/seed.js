const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust the path as necessary
const dotenv = require('dotenv');
const products = require('./data'); // Assume your product array is exported from data.js

dotenv.config();

const seedDatabase = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Clear the Product collection before seeding
        await Product.deleteMany({}); // Remove all existing products

        // Insert products one by one
        for (const productData of products) {
            const product = new Product(productData);
            await product.save();
        }

        console.log('Database seeded with products!');
    } catch (error) {
        console.error('Error seeding database:', error);
    } finally {
        // Close the database connection
        await mongoose.connection.close(); // Ensure proper closing of the connection
    }
};

seedDatabase();