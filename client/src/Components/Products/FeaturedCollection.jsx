import { Link } from "react-router-dom"
import FeaturedImg from '../../Assets/group_fashion.jpg'

const FeaturedCollection = () => {
    return (
        <section className="py-16 px-4 lg:px-0 grid place-items-center">
            <div 
            className="container flex flex-col-reverse lg:flex-row items-center bg-main-theme/50 rounded-t-2xl lg:rounded-r-2xl overflow-hidden">
                {/* Left content */}
                <div className="lg:w-1/2 text-center lg:text-left p-8">
                    <h2 className="text-lg font-semibold text-white mb-2">
                        Comfort and Styles
                    </h2>
                    <h2 className="text-4xl text-white lg:text-5xl font-bold mb-6">
                        Apparel made for your everyday life
                    </h2>
                    <p className="text-lg text-white font-medium mb-6">
                        Discover high-quality, comfortable clothing that effortlessly blends fashion and function. Designed to make you look and feel great every day.
                    </p>
                    <Link to='/collection/all'>
                        <button className="btn btn-wide border-0 bg-main-theme">Shop Now</button>
                    </Link>
                </div>

                {/* Right Content */}
                <div className="w-full h-[600px] lg:w-1/2">
                    <img
                        className="w-full h-full object-cover object-top"
                        src={FeaturedImg}
                        alt="Featured collection" />
                </div>
            </div>
        </section>
    )
}

export default FeaturedCollection