import { useEffect, useState } from "react";
import NewArrivalSlick from "../Tools/NewArrivalSlick";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;

const NewArrivals = () => {
    const [newArrivals, setNewArrivals] = useState([]);
    useEffect(() => {
        const fetchNewArrivals = async () => {
            try {
                const response = await axios.get(
                    `${API_URL}/api/products/new-arrivals`
                );
                setNewArrivals(response.data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchNewArrivals()
    }, []);
    return (
        <NewArrivalSlick
            newArrivals={newArrivals}
            imgHeight="500px"
            headTitle="Explore New Arrivals"
            subTitle="Discover the latest styles to keep your wardrobe cutting edge."
        />
    );
};

export default NewArrivals;
