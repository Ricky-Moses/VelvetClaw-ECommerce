import { FaXmark } from "react-icons/fa6";
import CartContents from "../Cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const CartDrawer = ({ drawerOpen, toggleDrawer }) => {
    const navigate = useNavigate();
    const { user, guestId } = useSelector((state) => state.auth);
    const { cart } = useSelector((state) => state.cart);
    const userId = user ? user._id : null;

    const handleCheckOut = () => {
        toggleDrawer();
        if (!user) {
            navigate("/login?redirect=checkout");
        } else {
            navigate("/checkout");
        }
    };

    return (
        <section
            className={`drawers fixed inset-0 w-3/4 sm:w-1/2 lg:w-1/4 h-full bg-white shadow-2xl transform transition-transform duration-300 flex flex-col z-60 ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                }`}
        >
            {/* Close button */}
            <div className="flex justify-end !p-2">
                <button
                    onClick={toggleDrawer}
                    className="btn bg-transparent shadow-none border-0"
                >
                    <FaXmark className="w-5 h-5 text-gray-600 cursor-pointer" />
                </button>
            </div>
            {/* Cart Content with Scrollbar */}
            <div className="flex-grow overflow-y-auto !p-4">
                <h2 className="font-bold text-xl">Your Cart</h2>
                {/* Component for Cart Content */}
                {cart && cart?.products?.length > 0 ? (
                    <CartContents cart={cart} userId={userId} guestId={guestId} />
                ) : (
                    <p className="">Your cart is empty</p>
                )}
            </div>
            {/* Checkout buttons fixed at the bottom */}
            <div className="sticky bottom-0 !p-2">
                {cart && cart?.products?.length > 0 && (
                    <>
                        <button
                            onClick={handleCheckOut}
                            type="button"
                            className="btn w-full bg-main-theme border-0"
                        >
                            Checkout
                        </button>
                        <p className="text-sm tracking-tighter text-center text-gray-600 !mt-2">
                            Shipping, taxes, and discount codes calculated at checkout.
                        </p>
                    </>
                )}
            </div>
        </section>
    );
};

export default CartDrawer;
