const mongoose = require("mongoose");

const ProductSchema = mongoose.Schema({
    title:{type:String},
    price:{type:Number},
    rating:{type:Number , min:1 , max:5},
    imageurl:{type:String},
})

const Products = mongoose.model("Product",ProductSchema);
module.exports = Products;