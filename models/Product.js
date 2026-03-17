const mongoose = require("mongoose")

const productSchema = mongoose.Schema({

 name:{
  type:String,
  required:true,
  index:true
 },

category:{
 type:String,
 required:true
},
 brand:String,

 price:{
  type:Number,
  required:true,
  index:true
 },

 description:String,

 image:String,

 countInStock:Number,

 rating:{
  type:Number,
  default:0
 },

 numReviews:{
  type:Number,
  default:0
 }

},{timestamps:true})

productSchema.index({name:"text"})

module.exports = mongoose.model("Product",productSchema)