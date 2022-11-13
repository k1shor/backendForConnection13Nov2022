// samsung mobile, acer laptop, sony headphone
// order items - sm - 5 , al - 2 , sh - 10
// order - orderitems - []

const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const orderItemsSchema = new mongoose.Schema({
    product: {
        type: ObjectId,
        ref: "Product",
        required: true
    },
    quantity:{
        type: Number,
        required: true
    }
},{timestamps: true})

module.exports = mongoose.model('OrderItems',orderItemsSchema)