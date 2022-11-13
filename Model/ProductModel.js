const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema

const ProductSchema = new mongoose.Schema({
    Product_name: {
        type: String,
        required: true,
        trim: true
    },
    Category:{
        type: ObjectId,
        ref: "Category",
        required: true
    },
    Product_price:{
        type: Number,
        required: true
    },
    Product_description:{
        type: String,
        required: true
    },
    Product_image: {
        type: String,
        required: true
    },
    Rating: {
        type: Number,
        required: true,
        default: 1,
    }
},{timestamps:true})

module.exports = mongoose.model('Product',ProductSchema)
