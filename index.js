import express from "express";
import multer from "multer";
import mongoose from "mongoose";
import { registerValidation, loginValidation,postCreateValidation } from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import { register,login,getMe } from "./controllers/UserController.js";
import * as postControllers from "./controllers/PostControllers.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";


mongoose
  .connect(
    "mongodb+srv://romanmeinl16:romanmeinl16@cluster0.uel1akm.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("DB ok"))
  .catch((err) => console.log("DB error", err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __,cb) => {
    cb(null, "uploads");
  },
  filename:(_,file, cb) => {
    cb(null,file.originalname);
  },
});

const upload = multer({storage});

app.use(express.json());
app.use("/uploads",express.static("uploads"));




app.post("/auth/login",handleValidationErrors,loginValidation,login )
app.post("/auth/register",handleValidationErrors, registerValidation,register );
app.get("/auth/me", checkAuth,getMe);

app.post("/upload", checkAuth,upload.single("image"),(req, res) => {
  res.json({
    url:`/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", postControllers.getAll);
app.get("/posts/:id",postControllers.getOne);
app.post("/posts",checkAuth,postCreateValidation, postControllers.create);
app.delete("/posts/:id",checkAuth, postControllers.remove);
app.patch("/posts/:id" ,checkAuth, postControllers.update);


app.listen(4444, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server OK");
});






