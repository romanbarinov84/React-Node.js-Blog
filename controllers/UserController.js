import UserModel from "../models/user.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const register = async (req, res) => {
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
  }

  export const login = async (req, res) => {
    try{
     const user = await UserModel.findOne({email:req.body.email});
  
     if(!user){
      return req.status(404).json({
        message: "Пользователь не найден"
      })
     }
  
     const isValidPass = await bcrypt.compare(req.body.password, user._doc.passwordHash);
     if(!isValidPass){
      return res.status(404).json({
        message: "Неверный логин или пароль"
      })
     }
     const token = jwt.sign(
      {
        _id:user._id,
      },
      "secret123",
      {
       expiresIn:"30d",
      },
     );
     const {passwordHash, ...userData} = user._doc;
     res.json({
      ...userData,
      token,
     });
    }
    catch(err){
      console.log(err);
      res.status(500).json({
        message: "Невеверный логин или пароль"
      });
      
    }
  }


  export const getMe =  async (req, res) => {
    try{
      const user = await UserModel.findById(req.userId);
  
      if(!user){
        return res.status(404).json({
          message: "Пользователь не найден"
        })
      }
        const {passwordHash, ...userData} = user._doc;
  
        res
  
  
  
      res.json({
        ...userData,
        
      });
    }catch(err){
  res.status(500).json({
    message: "Нет доступа"
  })
    }
  }