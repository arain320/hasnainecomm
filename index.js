const dotenv = require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const productRouter = require("./routes/productRoute");
const userRouter = require("./routes/userRouter");
const errorMessage = require("./middleWare/error");
const cookieParser = require("cookie-parser");

const app = express();
app.use(errorMessage);
const PORT = process.env.PORT || 5000;

//Middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());

const allowedOrigins = [
  "https://hasnainsaleem320.netlify.app",
  "http://localhost:5173",
];
const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));

//Routes middleware
app.use("/api", productRouter);
app.use("/api", userRouter);

// Error Middleware
app.use(errorMessage);

//connect to mongo DB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server is running on ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
