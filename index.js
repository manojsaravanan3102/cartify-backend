require("dotenv").config()

const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb")

const app = express()
const port = process.env.PORT || 5000

// ROUTES
const productRoutes = require("./routes/productRoutes")
const categoryRoutes = require("./routes/categoryRoutes")
const userRoutes = require("./routes/userRoutes")

app.use(cors())
app.use(express.json())

// ==========================
// MONGOOSE CONNECTION (for User auth)
// ==========================

mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("Mongoose Connected"))
.catch(err=>console.log(err))

// ==========================
// API ROUTES
// ==========================

app.use("/api/users", userRoutes)
app.use("/api/products", productRoutes)
app.use("/api/categories", categoryRoutes)

// ==========================
// MONGODB CLIENT (existing logic)
// ==========================

const uri = process.env.MONGO_URI

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true
  }
})

async function run() {

  try {

    await client.connect()

    const db = client.db("cartify")

    const productcollection = db.collection("products")
    const feedbackcollection = db.collection("feedback")

// =============================
// PRODUCT CREATE
// =============================

app.post("/products", async (req, res) => {

  try {

    const product = req.body

    if (!product.name || !product.price) {
      return res.status(400).json({
        message: "Name and price are required"
      })
    }

    const result = await productcollection.insertOne(product)

    res.status(201).json({
      message: "Product added successfully",
      result
    })

  } catch (error) {

    res.status(500).json({
      message: "Failed to add product"
    })

  }

})

// =============================
// GET ALL PRODUCTS
// =============================

app.get("/products", async (req, res) => {

  try {

    const products = await productcollection.find().toArray()

    res.status(200).json(products)

  } catch (error) {

    res.status(500).json({
      message: "Error fetching products"
    })

  }

})

// =============================
// GET SINGLE PRODUCT
// =============================

app.get("/products/:id", async (req, res) => {

  try {

    const id = req.params.id

    const product = await productcollection.findOne({
      _id: new ObjectId(id)
    })

    if (!product) {
      return res.status(404).json({
        message: "Product not found"
      })
    }

    res.status(200).json(product)

  } catch (error) {

    res.status(500).json({
      message: "Invalid product ID"
    })

  }

})

// =============================
// UPDATE PRODUCT
// =============================

app.patch("/products/:id", async (req, res) => {

  try {

    const id = req.params.id

    const updatedData = req.body

    const result = await productcollection.updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    )

    res.status(200).json(result)

  } catch (error) {

    res.status(500).json({
      message: "Error updating product"
    })

  }

})

// =============================
// DELETE PRODUCT
// =============================

app.delete("/products/:id", async (req, res) => {

  try {

    const id = req.params.id

    const result = await productcollection.deleteOne({
      _id: new ObjectId(id)
    })

    res.status(200).json({
      message: "Product deleted",
      result
    })

  } catch (error) {

    res.status(500).json({
      message: "Delete failed"
    })

  }

})

// =============================
// ADD FEEDBACK
// =============================

app.post("/feedback", async (req, res) => {

  try {

    const feedback = req.body

    const result = await feedbackcollection.insertOne(feedback)

    res.status(201).json({
      message: "Feedback added",
      result
    })

  } catch (error) {

    res.status(500).json({
      message: "Feedback failed"
    })

  }

})

console.log("MongoDB Connected")

  } finally {
  }

}

run().catch(console.dir)

// ==========================
// ROOT ROUTE
// ==========================

app.get("/", (req, res) => {
  res.send("Cartify API Running")
})

// ==========================
// SERVER START
// ==========================

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})