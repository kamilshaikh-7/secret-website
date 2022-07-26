require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const ejs = require("ejs");
// const md5 = require("md5");  node module for hash function
const bcrypt = require("bcrypt");
const saltRounds = 10;

const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userDB", {useNewUrlParser: true});

const userSchema = mongoose.Schema({
    email: String,
    password: String
});

const User = mongoose.model("User", userSchema);  

app.get("/", function (req, res) {
    res.render("home"); 
});
app.get("/login", function (req, res) {
    res.render("login", {errLine: ""}); 
});
app.get("/register", function (req, res) {
    res.render("register"); 
});
app.get("/submit", function (req, res) {
    res.render("submit"); 
});

app.post("/register", function (req, res) {

    bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash   //hash function converts plain password to hash
        });
        newUser.save(function (err) {
            if (!err) {
                res.render("secrets");
            } else {
                console.log(err);
            }
        });
    });
    
});

app.post("/login", function (req, res) {
    const username = req.body.username;
    const password = req.body.password;

    User.findOne({ email: username }, function (err, foundUser) {
        if (!err) {
            if (foundUser) {
                bcrypt.compare(password, foundUser.password, function (err, result) {
                    if (result === true) {
                        res.render("secrets");
                    } else {
                        res.render("login", { errLine: "Email or Password does not match" });
                    }
                });
            }
            else {
                res.render("login", { errLine: "Email or Password does not match" });
            }
        } else {
            console.log(err);
        }
    });
});

app.listen(3000, function () {
    console.log("Server running on port 3000");
});