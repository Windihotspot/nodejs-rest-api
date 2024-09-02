const express = require("express");

const app = express();
const morgan = require("morgan");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const productsRoutes = require("./api/routes/products");
const ordersRoutes = require("./api/routes/orders");

mongoose
  .connect(
    "mongodb+srv://boiwindihotspot:EGuvbIhygg9r4tNG@node-rest-shop.q66nw.mongodb.net/?retryWrites=true&w=majority&appName=node-rest-shop",
    {
      serverSelectionTimeoutMS: 10000,
    }
  )
  .then(() => console.log("Connected to MongoDB Atlas"))
  .catch((err) => console.error("Failed to connect to MongoDB Atlas", err));

app.use(morgan("dev"));
// app.use((req, res, next) =>{
//     res.status(200).json({
//         message: 'it works'
//     })
// })

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.use("/products", productsRoutes);
app.use("/orders", ordersRoutes);

app.use((req, res, next) => {
  const error = new Error("NOT FOUND");
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

module.exports = app;
