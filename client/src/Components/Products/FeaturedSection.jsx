import { GiShoppingBag } from "react-icons/gi";
import { HiArrowPathRoundedSquare } from "react-icons/hi2";
import { CiCreditCard1 } from "react-icons/ci";

const FeaturedSection = () => {
  return (
    <section className="py-16 px-4 bg-white">
        <div className="container grid grid-cols-1 md:grid-cols-3 gap-8 text-center mx-auto">
            {/* Featured 1 */}
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <GiShoppingBag className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2">FREE INTERNATIONAL SHIPPING</h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    On all orders over ₹100.00
                </p>
            </div>
            {/* Featured 2 */}
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <HiArrowPathRoundedSquare className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2">45 DAYS RETURN</h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    Money back guarantee
                </p>
            </div>
            {/* Featured 3 */}
            <div className="flex flex-col items-center">
                <div className="p-4 rounded-full mb-4">
                    <CiCreditCard1 className="text-xl" />
                </div>
                <h4 className="tracking-tighter mb-2">SECURE CHECKOUT</h4>
                <p className="text-gray-600 text-sm tracking-tighter">
                    100% secured checkout process
                </p>
            </div>
        </div>
    </section>
  )
}

export default FeaturedSection