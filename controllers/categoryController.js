const Category = require("../models/Category")

// CREATE CATEGORY (ADMIN)
const createCategory = async(req,res)=>{

 try{

   const {name,slug} = req.body

   const category = new Category({
     name,
     slug
   })

   const createdCategory = await category.save()

   res.status(201).json(createdCategory)

 }catch(error){

   res.status(500).json({
     message:"Error creating category"
   })

 }

}


// GET ALL CATEGORIES
const getCategories = async(req,res)=>{

 const categories = await Category.find()

 res.json(categories)

}


// DELETE CATEGORY (ADMIN)
const deleteCategory = async(req,res)=>{

 const category = await Category.findById(req.params.id)

 if(category){

   await category.deleteOne()

   res.json({message:"Category removed"})

 }else{

   res.status(404).json({message:"Category not found"})

 }

}

module.exports={
 createCategory,
 getCategories,
 deleteCategory
}