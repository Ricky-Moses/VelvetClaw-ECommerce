import mongoose from "mongoose";
import dotenv from 'dotenv'
import User from "./Models/User.js";
import Product from "./Models/Product.js";
import Cart from "./Models/Cart.js";
import products from "./Data/products.js";

dotenv.config()

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)

// Function to seed data
const seedData = async () => {
    try{
        // Clear existing data
        await User.deleteMany();
        await Product.deleteMany();
        await Cart.deleteMany();

        // Create a default admin User
        const createdUser = await User.create({
            name: "Admin User",
            email: "admin@example.com",
            password: "123456",
            role: "admin"
        })

        // Assign the default user ID to each product
        const userID = createdUser._id

        const sampleProducts = products?.map((product) => {
            return {...product, user: userID}
        })

        await Product.insertMany(sampleProducts)

        console.log("Product data seeded successfully")
        process.exit()
    }
    catch(err){
        console.error("Error seeding the data: ", err)
        process.exit(1)
    }
}

seedData();