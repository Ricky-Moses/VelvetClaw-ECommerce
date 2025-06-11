import { useEffect, useState } from "react"
import Hero from "../Components/Layouts/Hero"
import FeaturedCollection from "../Components/Products/FeaturedCollection"
import FeaturedSection from "../Components/Products/FeaturedSection"
import GenderCollection from "../Components/Products/GenderCollection"
import NewArrivals from "../Components/Products/NewArrivals"
import ProductDetails from "../Components/Products/ProductDetails"
import ProductGrid from "../Components/Products/ProductGrid"
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductByFilters } from "../Redux/Slice/ProductSlice"
import axios from "axios"

const API_URL = import.meta.env.VITE_BACKEND_URL;
const Home = () => {
    const dispatch = useDispatch()
    const { products, loading, error } = useSelector(state => state.products)
    const [bestSellerProduct, setBestSellerProduct] = useState(null)

    useEffect(() => {
        // fetch products for a specific collection
        dispatch(
            fetchProductByFilters({
                gender: "Women",
                category: "Bottom Wear",
                limit: 8
            })
        )
        // Fetch best sellers
        const fetchBestSellers = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/products/best-seller`
                );
                setBestSellerProduct(response?.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchBestSellers()
    }, [dispatch])
    // console.log(bestSellerProduct)
    return (
        <>
            <Hero />
            <GenderCollection />
            <NewArrivals />

            {/* Best Sellers */}
            <h2 className="text-3xl text-center font-bold mb-4">Best Sellers</h2>
            {bestSellerProduct ? (
                <ProductDetails productId={bestSellerProduct?._id} />
            ) : (
                <div className="">
                    <span className="loading"></span>
                    <span className="">Loading best seller product....</span>
                </div>
            )}

            {/* For Women */}
            <div className="container mx-auto">
                <h2 className="text-2xl text-center font-bold mb-4">
                    Top Wears For Women
                </h2>
                <ProductGrid Products={products} loading={loading} error={error} />
            </div>

            {/* Featured Collection */}
            <FeaturedCollection />

            {/* Featured Section */}
            <FeaturedSection />
        </>
    )
}

export default Home