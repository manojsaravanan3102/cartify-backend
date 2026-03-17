const Product = require("../models/Product")

// GET PRODUCTS
const getProducts = async (req,res)=>{

 const pageSize = 20
 const page = Number(req.query.page) || 1

 const count = await Product.countDocuments()

 const products = await Product.find()
   .limit(pageSize)
   .skip(pageSize*(page-1))

 res.json({
   products,
   page,
   pages:Math.ceil(count/pageSize)
 })

}


// GET SINGLE PRODUCT
const getProductById = async (req,res)=>{

 const product = await Product.findById(req.params.id)

 if(product){
   res.json(product)
 }else{
   res.status(404).json({message:"Product not found"})
 }

}




// CREATE PRODUCT
const createProduct = async (req, res) => {

 try {

  const {
   name,
   price,
   category,
   brand,
   description,
   countInStock,
   image
  } = req.body

  if (!name || !price || !category) {
   return res.status(400).json({
    message: "Name, price and category are required"
   })
  }

  const product = new Product({
   name,
   price,
   category,
   brand: brand || "",
   description: description || "",
   countInStock: countInStock || 0,
   image: image || ""
  })

  const createdProduct = await product.save()

  res.status(201).json(createdProduct)

 } catch (error) {

  console.error(error)

  res.status(500).json({
   message: "Product creation failed"
  })

 }

}


// UPDATE PRODUCT
const updateProduct = async (req,res)=>{

 const product = await Product.findById(req.params.id)

 if(product){

   product.name = req.body.name
   product.price = req.body.price
   product.brand = req.body.brand
   product.category = req.body.category
   product.description = req.body.description
   product.countInStock = req.body.countInStock

   const updatedProduct = await product.save()

   res.json(updatedProduct)

 }else{

   res.status(404).json({message:"Product not found"})

 }

}


// DELETE PRODUCT
const deleteProduct = async (req,res)=>{

 const product = await Product.findById(req.params.id)

 if(product){

   await product.deleteOne()

   res.json({message:"Product deleted"})

 }else{

   res.status(404).json({message:"Product not found"})

 }

}

module.exports = {
 getProducts,
 getProductById,
 createProduct,
 updateProduct,
 deleteProduct
}