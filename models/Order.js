const mongoose = require("mongoose")

const productSchema = mongoose.Schema({

 name:String,
 price:Number,
 image:String,
 brand:String,
 category:String,
 description:String,
 countInStock:Number

},{timestamps:true})

module.exports = mongoose.model("Product",productSchema)