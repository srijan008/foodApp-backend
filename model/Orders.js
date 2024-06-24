const { Schema, model } = require("mongoose");

const orderSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    order_data: {
        type: Array,
        required: true
    }
}, { timestamps: true });

const Order = model("Order", orderSchema);

module.exports = Order;
