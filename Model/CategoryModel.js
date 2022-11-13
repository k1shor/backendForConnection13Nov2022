const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
    Category_name:{
        type: String,
        required: true,
        trim: true
    }
},{timestamps:true})

module.exports = mongoose.model('Category',CategorySchema)
