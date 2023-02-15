const mongoose = require("mongoose")

const Orderschema = mongoose.Schema({
    products:Array,
    price:Number,
    address : Object,
    email:String
})

const Orders = mongoose.model("Order",Orderschema);

module.exports = Orders;