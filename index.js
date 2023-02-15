const express = require("express");
const cors = require("cors");
const Product = require("./model/product")
const port = 3001;
const app = express();
const mongoose = require("mongoose");
const User = require("./model/users");
const bcrypt = require("bcrypt");
const Orders = require("./model/order");

const connection_url = "mongodb+srv://PankajSen:jaishreemahankal@cluster0.uht6vsk.mongodb.net/?retryWrites=true&w=majority"

mongoose.set('strictQuery', true);
mongoose.connect(connection_url, (err) => {
    if (err) {
        console.log("mongo connection failed ", err);
    }
    else {
        console.log("mongo connected succesfully");
    }
})
//middlewares
app.use(express.json());
app.use(cors());

app.get("user/get", (req, res) => {

})
app.get("/products/get", async (req, res) => {
    try {
        const data = await Product.find();
        res.status(200).json({
            status: "success",
            data
        })
    }
    catch (e) {
        res.status(500).json({
            status: "failure",
            message: e.message
        })
    }

})

app.post("/products/add", async (req, res) => {
    try {
        const productDetail = req.body;
        await Product.create(productDetail);
        res.status(200).json({
            status: "success",
            productDetail
        })
    }
    catch (e) {
        res.status(500).json({
            status: e.message
        })
    }

})

//signup api
app.post("/auth/signup", async (req, res) => {
    try {
        const { email, password, name } = req.body;
        const encrypt_password = await bcrypt.hash(password, 10);
        const signupdetail = {
            email: email,
            password: encrypt_password,
            name: name,
        };
        const user_exist = await User.findOne({ email: email });
        if (user_exist) {
            res.json({ message: "User already exists !" });
        }
        else {
            await User.create(signupdetail);
            res.status(200).json({
                status: "success",
                signupdetail
            })
        }
    }
    catch (e) {
        res.status(500).json({
            status: e.message
        })
    }

})
//login api
app.post("/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const logindetail = await User.findOne({ email: email });
    if (logindetail) {
        if (await bcrypt.compare(password, logindetail.password)) {
            res.send(logindetail);
        } else {
            res.send({ error: "invaild Password" });
        }
    } else {
        res.send({ error: "Please go to signup page and create account" });
    }
})



//orders api

app.post("/orders/add", async (req, res) => {
    try {
        const products = req.body.products;
        const price = req.body.price;
        const email = req.body.email;
        const address = req.body.address;

        const orderdetails = { products: products, price: price, email: email, address: address }

        const Ordered = await Orders.create(orderdetails);
        res.status(200).json({
            status: "success",
            Ordered
        })

    }
    catch (e) {
        res.status(500).json({
            status: "failure",
            Message: e.message
        })
    }

})

app.post("/orders/get", async (req, res) => {
    try{
    const email = req.body.email
    const orderdetails = await Orders.find({ email: email});
    res.status(200).json({
        status: "success",
        orderdetails
    })
}
catch(e){
    res.status(500).json({
        status: "failure",
        message:e.Message
    })
}
})


app.listen(port, () => {
    console.log(`server is up at ${port}`);
})