const express = require("express");
const router = new express.Router();
const product = require("../models/productModel");

router.post("/product", async (req, res) => {
  const { name, price, url, category, company, tag, description } = req.body;

  console.log(req.body);

  if (
    !name ||
    !price ||
    !url ||
    !category ||
    !company ||
    !tag ||
    !description
  ) {
    res
      .status(401)
      .json({ status: 401, message: "please fill all the fields" });
  }
  try {
    const productData = new product({
      name: name,
      price: price,
      path: url,
      category: category,
      company: company,
      tag: tag,
      description: description,
    });
    const finalProduct = await productData.save();
    res.status(201).json({ status: 201, finalProduct });
  } catch (err) {
    res.status(401).json({ status: 401, err });
  }
});

//get all product from database
router.get("/items", async (req, res) => {
  try {
    const getItems = await product.find().sort({ productId: "desc" });
    res.status(201).json({ status: 201, getItems });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
//get all product of special tag from database
router.get("/special", async (req, res) => {
  try {
    const getItems = await product
      .find({ tag: "special" })
      .sort({ productId: "desc" })
      .limit(18);
    res.status(201).json({ status: 201, getItems });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
//get all product of popular tag from database
router.get("/popular", async (req, res) => {
  try {
    const getItems = await product
      .find({ tag: "popular" })
      .sort({ productId: "desc" })
      .limit(12);
    res.status(201).json({ status: 201, getItems });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
//get all product of deal tag from database
router.get("/deal", async (req, res) => {
  try {
    const getItems = await product
      .find({ tag: "deal" })
      .sort({ productId: "desc" })
      .limit(12);
    res.status(201).json({ status: 201, getItems });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//get single product from database
router.get("/loadProduct/:id", async (req, res) => {
  try {
    const singleItem = await product.find({ _id: req.params.id });
    res.status(201).json({ status: 201, singleItem });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});
//get product of same category from database
router.get("/category", async (req, res) => {
  try {
    const products = await product.find();
    console.log("products" + " " + products);
    res.status(201).json({ status: 201, products });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

//update product

router.patch("/update/:id", async (req, res) => {
  const { name, price, path, category, company, tag, description } = req.body;
  const { id } = req.params;
  try {
    const result = await product.findByIdAndUpdate(id, req.body, { new: true });
    res.status(201).json({ status: 201, result });
  } catch (err) {
    res.status(401).json({ status: 401, err });
  }
});

//delete product
router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params;
  console.log(id);
  try {
    const deleteProduct = await product.findByIdAndDelete(id);
    res
      .status(201)
      .json({ status: 201, message: "product deleted", deleteProduct });
  } catch (error) {
    res.status(401).json({ status: 401, error });
  }
});

module.exports = router;
