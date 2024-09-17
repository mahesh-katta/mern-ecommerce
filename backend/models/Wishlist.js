const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
});

const wishlistSchema = new mongoose.Schema({
    customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
    items: [wishlistItemSchema],
    createdAt: { type: Date, default: Date.now }
});

const Wishlist = mongoose.model("Wishlist", wishlistSchema);
module.exports = Wishlist;