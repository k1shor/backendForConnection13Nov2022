const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderSchema = new mongoose.Schema({
    orderItems: [{
        type: ObjectId,
        ref: "OrderItems",
        required: true
    }],
    totalPrice:{
        type: Number,
        required: true
    },
    user:{
        type: ObjectId,
        ref: "User",
        required: true
    },
    shippingAddress: {
        type: String,
        required: true
    },
    alternateShippingAddress:{
        type: String
    },
    city:{
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zipcode: {
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    }
},{timestamps: true})

module.exports = mongoose.model('Order',orderSchema)