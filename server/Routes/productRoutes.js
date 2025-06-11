import express from "express";
import Product from "../Models/Product.js";
import { protect, admin } from "../Middleware/authMiddleware.js";
import mongoose from "mongoose";

const router = express.Router();

// @route POST /api/products
// @desc Create a new Product
// @access Private/Admin
router.post("/", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
    } = req.body;

    // Basic validation
    if (!name || !price || !countInStock || !category || !sku) {
      return res.status(400).json({
        message:
          "Missing required fields: name, price, countInStock, category, or sku",
      });
    }

    // Validate images
    if (!images || !Array.isArray(images) || images.length === 0) {
      return res
        .status(400)
        .json({ message: "At least one image is required" });
    }

    const product = new Product({
      name,
      description,
      price,
      originalPrice,
      countInStock,
      category,
      brand,
      sizes: sizes || [],
      colors: colors || [],
      collections,
      material,
      gender,
      images,
      isFeatured: isFeatured || false,
      isPublished: isPublished !== undefined ? isPublished : true,
      tags: tags || [],
      dimension,
      weight,
      sku,
      user: req.user._id,
    });

    const createdProduct = await product.save();
    console.log("✅ Product created:", createdProduct._id);
    res.status(201).json(createdProduct);
  } catch (err) {
    console.error("❌ Error creating product:", err);
    if (err.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation error",
        errors: Object.values(err.errors).map((e) => e.message),
      });
    }
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

// @route PUT /api/products/:id
// @desc Update an existing Product ID
// @access Private/Admin
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      originalPrice,
      countInStock,
      category,
      brand,
      sizes,
      colors,
      collections,
      material,
      gender,
      images,
      isFeatured,
      isPublished,
      tags,
      dimension,
      weight,
      sku,
    } = req.body;

    // Find product field
    const product = await Product.findById(req.params.id);

    if (product) {
      // Update product fields
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.originalPrice = originalPrice || product.originalPrice;
      product.countInStock = countInStock || product.countInStock;
      product.category = category || product.category;
      product.brand = brand || product.brand;
      product.sizes = sizes || product.sizes;
      product.colors = colors || product.colors;
      product.collections = collections || product.collections;
      product.material = material || product.material;
      product.gender = gender || product.gender;
      product.images = images || product.images;
      product.isFeatured =
        isFeatured !== undefined ? isFeatured : product.isFeatured;
      product.isPublished =
        isPublished !== undefined ? isPublished : product.isPublished;
      product.tags = tags || product.tags;
      product.dimension = dimension || product.dimension;
      product.weight = weight || product.weight;
      product.sku = sku || product.sku;

      // Save the updated product
      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not founded!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route DELETE /api/products/:id
// @route Delete a product by ID
// @route Private/Admin
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    // Find the product by ID
    const product = await Product.findById(req.params.id);

    if (product) {
      // Remove the product from DB
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not founded!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// @route DELETE /api/products
// @route GET all products with optional query filter
// @route Public
router.get("/", async (req, res) => {
  try {
    const {
      collections,
      category,
      material,
      brand,
      sizes,
      colors,
      gender,
      minPrice,
      maxPrice,
      sortBy,
      search,
      limit,
    } = req.query;

    let query = {};

    // Filter logic
    if (collections && collections.toLocaleLowerCase() !== "all") {
      query.collections = collections;
    }

    if (category && category.toLocaleLowerCase() !== "all") {
      query.category = category;
    }

    if (material) {
      query.material = { $in: material.split(",") };
    }

    if (brand) {
      query.brand = { $in: brand.split(",") };
    }

    if (sizes) {
      query.sizes = { $in: sizes.split(",") };
    }

    if (colors) {
      query.colors = { $in: [colors] };
    }

    if (gender) {
      query.gender = gender;
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Sort Logic
    let sort = {};
    if (sortBy) {
      switch (sortBy) {
        case "priceAsc":
          sort = { price: 1 };
          break;
        case "priceDesc":
          sort = { price: -1 };
          break;
        case "popularity":
          sort = { rating: -1 };
          break;
        default:
          break;
      }
    }

    // Fetch products and apply sorting and limit
    let products = await Product.find(query)
      .sort(sort)
      .limit(Number(limit) || 0);
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/best-seller
// @desc Retrieve the product with highest rating
// @access Public
router.get("/best-seller", async (req, res) => {
  try {
    const bestSeller = await Product.findOne().sort({ rating: -1 });
    if (bestSeller) {
      res.json(bestSeller);
    } else {
      res.status(404).json({ message: "No best seller founded!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/new-arrivals
// @desc Retrieve latest 8 products - Creation data
// @access Public
router.get("/new-arrivals", async (req, res) => {
  try {
    // Fetch latest 8 products
    const newArrivals = await Product.find().sort({ createdAt: -1 }).limit(8);
    res.json(newArrivals);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/similar/:id
// @desc Get a single product by ID
// @access Public
router.get("/similar/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Received ID:", id, "Type:", typeof id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log("Invalid ObjectId format:", id);
    return res.status(400).json({ message: "Invalid product ID format" });
  }

  try {
    // Log all products in the collection
    const allProducts = await Product.find({});
    console.log(
      "All Products:",
      allProducts.map((p) => ({ _id: p._id.toString(), name: p.name }))
    );

    const product = await Product.findById(id);
    console.log("Fetched Product:", product);

    if (!product) {
      console.log("Product not found with ID:", id);
      return res.status(404).json({ message: "Product not found!" });
    }

    const similarProducts = await Product.find({
      _id: { $ne: id },
      gender: product.gender,
      category: product.category,
    }).limit(4);
    console.log(
      "Similar Products:",
      similarProducts.map((p) => ({ _id: p._id.toString(), name: p.name }))
    );

    res.json(similarProducts);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).send("Server Error");
  }
});

// @route GET /api/products/:id
// @desc Get a single product by ID
// @access Public
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product Not Founded!" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

export default router;
