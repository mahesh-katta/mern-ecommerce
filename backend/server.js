const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors'); // Import CORS
const connectDB= require('./config/db');
const accountRoutes = require('./routes/Accounts');
const productRoutes = require('./routes/Products');
const cartRoutes = require('./routes/Cart');
const wishlistRoutes = require('./routes/Wishlist');

dotenv.config();
const app = express();
connectDB(); // Connect to the database

app.use(express.json()); // Middleware to parse JSON requests
app.use(cors());
// Routes
app.use('/api', accountRoutes);
app.use('/api', productRoutes);
app.use('/api', cartRoutes);
app.use('/api', wishlistRoutes);

const PORT = process.env.PORT || 8086;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});