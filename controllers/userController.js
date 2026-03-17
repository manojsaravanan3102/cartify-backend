const { MongoClient } = require("mongodb")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const uri = process.env.MONGO_URI
const client = new MongoClient(uri)

const generateToken = (id)=>{
 return jwt.sign({id},process.env.JWT_SECRET,{expiresIn:"30d"})
}

// REGISTER USER
const registerUser = async (req,res)=>{

 try{

  await client.connect()
  const db = client.db("cartify")
  const users = db.collection("users")

  const {name,email,password,isAdmin} = req.body

  const userExists = await users.findOne({email})

  if(userExists){
   return res.status(400).json({
    message:"User already exists"
   })
  }

  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password,salt)

  const newUser = {
   name,
   email,
   password:hashedPassword,
   isAdmin:isAdmin || false
  }

  const result = await users.insertOne(newUser)

  res.status(201).json({
   _id:result.insertedId,
   name,
   email,
   isAdmin:newUser.isAdmin,
   token:generateToken(result.insertedId)
  })

 }catch(error){

  console.error(error)

  res.status(500).json({
   message:"Server error"
  })

 }

}


// LOGIN USER
const loginUser = async (req,res)=>{

 try{

  await client.connect()
  const db = client.db("cartify")
  const users = db.collection("users")

  const {email,password} = req.body

  const user = await users.findOne({email})

  if(!user){
   return res.status(401).json({
    message:"Invalid email or password"
   })
  }

  const match = await bcrypt.compare(password,user.password)

  if(!match){
   return res.status(401).json({
    message:"Invalid email or password"
   })
  }

  res.json({
   _id:user._id,
   name:user.name,
   email:user.email,
   isAdmin:user.isAdmin,
   token:generateToken(user._id)
  })

 }catch(error){

  console.error(error)

  res.status(500).json({
   message:"Server error"
  })

 }

}

module.exports={
 registerUser,
 loginUser
}