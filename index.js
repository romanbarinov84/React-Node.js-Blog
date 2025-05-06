import express from "express";
import mongoose from "mongoose";
import { registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import { register,login,getMe } from "./controllers/UserController.js";



mongoose
  .connect(
    "mongodb+srv://romanmeinl16:romanmeinl16@cluster0.uel1akm.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

app.use(express.json());

app.post("/auth/login",login )



app.post("/auth/register", registerValidation,register );

app.get("/auth/me", checkAuth,getMe)

app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server OK");
});
