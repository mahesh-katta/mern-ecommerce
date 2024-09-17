const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true, min: 1 }
});

const cartSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [cartItemSchema],
    createdAt: { type: Date, default: Date.now }
});

const Cart = mongoose.model("Cart", cartSchema);
module.exports = Cart;