const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Product = require("./models/products");

router.get("/", (req, res, next) => {
  Product.find()
    .exec()
    .then((docs) => {
      console.log(docs);
      res.status(200).json(docs);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // res.status(200).json({
  //   message: "Handling Get requests to /products",
  // });
});

router.post("/", (req, res, next) => {
  // const product = {
  //     name:req.body.name,
  //     price:req.body.price
  // }

  const product = new Product({
    _id: new mongoose.Types.ObjectId(),
    name: req.body.name,
    price: req.body.price,
  });
  product
    .save()
    .then((result) => {
      console.log(result);
      res.status(201).json({
        message: "Handling post requests to /products",
        createdProduct: result,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.get("/:productsId", (req, res, next) => {
  const id = req.params.productsId;
  Product.findById(id)
    .exec()
    .then((doc) => {
      console.log("from database", doc);
      if (doc.length >= 0) {
        res.status(200).json(doc);
      } else res.status(404).json({ message: "No valid entries found " });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ error: err });
    });

  // if (id === 'special') {
  //     res.status(200).json({
  //         message: 'you discovered the special ID',
  //         id: id
  //     })
  // } else {
  //     res.status(200).json({
  //         message: 'You passed an ID'
  //     })
  // }
});

router.patch("/:productsId", (req, res, next) => {
  const id = req.params.productsId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.updateOne({ _id: id }, { $set: updateOps })
    .exec()
    .then((result) => {
      console.log(result);
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
});

router.delete("/:productsId", (req, res, next) => {
  const id = req.params.productsId;
  Product.deleteOne({ _id: id })
    .exec()
    .then((result) => {
      res.status(200).json(result);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({
        error: err,
      });
    });
  // res.status(200).json({
  //   message: "deleted product",
  // });
});

module.exports = router;
