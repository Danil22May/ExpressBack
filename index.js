import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations.js";

import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import checkAuth from "./utils/checkAuth.js";
import handleValidationErrors from "./utils/handleValidationErrors.js";

mongoose
  .connect(
    "mongodb+srv://daniilmej88:Jx5Vea9Ca87rH-a@cluster0.aueri08.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => {
    console.log("DB is ok");
  })
  .catch(() => {
    console.log("DB error");
  });

const app = express();
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(cors());

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.get("/auth/me", checkAuth, UserController.getMe);
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get("/posts", checkAuth, postCreateValidation, PostController.getAll);
app.get("/post/:id", PostController.getById);
app.post("/post", checkAuth, postCreateValidation, PostController.create);
app.delete("/post/:id", checkAuth, PostController.destroy);
app.patch("/post/:id", checkAuth, PostController.update);

app.get("/", (req, res) => {
  res.json({ user: "hello" });
});

app.listen(8080, (err) => {
  if (err) {
    return console.log(err);
  }
  console.log("server is ok");
});
