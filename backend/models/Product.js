const mongoose = require("mongoose");
const AutoIncrement = require('mongoose-sequence')(mongoose);

const productSchema = new mongoose.Schema({
    productId: { type: Number, unique: true }, // This needs to be set correctly
    name: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    color: { type: String }, 
    category: { type: String, required: true },
    discount: { type: Number, default: 0, min: 0 },
    description: { type: String },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        reviewText: { type: String, required: true },
        rating: { type: Number, min: 0, max: 5 },
        createdAt: { type: Date, default: Date.now } 
    }],
    stock: { type: Number, required: true, min: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Apply auto-incrementing to productId
productSchema.plugin(AutoIncrement, { inc_field: 'productId' });

const Product = mongoose.model("Product", productSchema);
module.exports = Product;