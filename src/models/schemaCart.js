const mongoose = require('mongoose');

const cartCollection = 'carrito';

const cartSchema = new mongoose.Schema({
    id: {type: String, required: true},
    timestamp: { type: Date, required: true},
    productos: { type: Object}
})

const carts = mongoose.model(cartCollection, cartSchema);

module.exports = carts;