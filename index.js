import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { registerValidation } from "./validations/auth.js";
import UserModel from "./models/user.js";

mongoose
  .connect(
    "mongodb+srv://romanmeinl16:romanmeinl16@cluster0.uel1akm.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

app.post("/auth/login", async (req, res) => {
  try{
   const user = await UserModel.findOne({email:req.body.email});

   if(!user){
    return req.status(404).json({
      message: "Пользователь не найден"
    })
   }
  }
  catch(err){

  }
})



app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModel({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      passwordHash: hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const {passwordHash, ...userData} = user._doc;

    res.json({
      ...userData,
      token,
    });

  } catch (err) {
    console.log("Register error:", err.message);
 
    res.status(500).json({
      message: "Не удалось зарегистрироватся",
    });
  }
});

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server OK");
});
