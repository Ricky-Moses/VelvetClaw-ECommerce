import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PayPalButton from "./PayPalButton";
import { createCheckout } from "../../Redux/Slice/checkoutSlice";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const USER_TOKEN = `Bearer ${localStorage.getItem("userToken")}`;

const CheckOut = () => {
  const dispatch = useDispatch();
  const { cart, loading, error } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [checkoutId, setCheckoutId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  useEffect(() => {
    if (!cart || !cart.products || cart.products.length === 0) {
      navigate("/");
    }
  }, [cart, navigate]);

  useEffect(() => {
    console.log("Checkout ID updated:", checkoutId);
  }, [checkoutId]);

  const handleCreateCheckout = async (e) => {
    e.preventDefault();
    const { firstName, lastName, address, city, postalCode, country, phone } = shippingAddress;
    if (!firstName || !lastName || !address || !city || !postalCode || !country || !phone) {
      alert("Please fill in all shipping details.");
      return;
    }
    if (!phone.match(/^[0-9]{10}$/)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }
    if (cart && cart.products.length > 0) {
      try {
        const res = await dispatch(
          createCheckout({
            checkoutItems: cart.products,
            shippingAddress,
            paymentMethod: "Paypal",
            totalPrice: cart.totalPrice,
          })
        );
        if (res.payload && res.payload._id) {
          setCheckoutId(res.payload._id);
        } else {
          console.error("Checkout creation failed:", res.error);
          alert("Failed to create checkout. Please try again.");
        }
      } catch (err) {
        console.error("Checkout error:", err);
        alert("An error occurred. Please try again.");
      }
    } else {
      alert("Your cart is empty!");
      navigate("/");
    }
  };

  const handlePaymentSuccess = async (details) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/checkout/${checkoutId}/pay`,
        {
          paymentStatus: "paid",
          paymentDetails: details,
        },
        {
          headers: {
            Authorization: USER_TOKEN,
          },
        }
      );
      if (response.status === 200) {
        await handleFinalizeCheckout(checkoutId);
      } else {
        alert("Payment update failed. Please contact support.");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment processing failed. Please try again.");
    }
  };

  const handleFinalizeCheckout = async (checkoutId) => {
    try {
      await axios.post(
        `${API_URL}/api/checkout/${checkoutId}/finalize`,
        {},
        {
          headers: {
            Authorization: USER_TOKEN,
          },
        }
      );
      navigate("/order-confirmation");
    } catch (err) {
      console.error("Finalize error:", err);
      alert("Failed to finalize order. Please contact support.");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <span className="loading"></span>
        <span className="ml-2">Loading....</span>
      </div>
    );
  if (error)
    return (
      <div className="text-center text-red-500">
        <span>Error: {error}</span>
      </div>
    );
  if (!cart || !cart.products || cart.products.length === 0) {
    return <p className="text-center">Your cart is empty!</p>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto py-10 px-6">
      {/* Left Section */}
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-6">CHECKOUT</h2>
        <form onSubmit={handleCreateCheckout} className="space-y-4">
          <h3 className="text-lg font-semibold mb-4">Contact Details</h3>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="input w-full !bg-neutral-200 !text-black border-0 focus:outline-main-theme"
              value={user ? user?.email : ""}
              disabled
            />
          </div>
          <h3 className="text-lg font-semibold mb-4">Delivery</h3>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-gray-700">First Name</label>
              <input
                type="text"
                value={shippingAddress.firstName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, firstName: e.target.value })
                }
                className="input w-full bg-neutral-200 focus:outline-main-theme"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Last Name</label>
              <input
                type="text"
                value={shippingAddress.lastName}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, lastName: e.target.value })
                }
                className="input w-full bg-neutral-200 focus:outline-main-theme"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Address</label>
            <input
              type="text"
              value={shippingAddress.address}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, address: e.target.value })
              }
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700">City</label>
              <input
                type="text"
                value={shippingAddress.city}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, city: e.target.value })
                }
                className="input w-full bg-neutral-200 focus:outline-main-theme"
                required
              />
            </div>
            <div>
              <label className="block text-gray-700">Postal Code</label>
              <input
                type="text"
                value={shippingAddress.postalCode}
                onChange={(e) =>
                  setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                }
                className="input w-full bg-neutral-200 focus:outline-main-theme"
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              value={shippingAddress.country}
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, country: e.target.value })
              }
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Phone no.</label>
            <input
              type="tel"
              value={shippingAddress.phone}
              pattern="[0-9]{10}"
              maxLength="10"
              onChange={(e) =>
                setShippingAddress({ ...shippingAddress, phone: e.target.value })
              }
              className="input w-full bg-neutral-200 focus:outline-main-theme"
              required
            />
          </div>
          <div className="mt-6">
            {!checkoutId ? (
              <button
                type="submit"
                className="btn w-full border-0 !bg-main-theme text-white"
              >
                Continue to payment
              </button>
            ) : (
              <div>
                <h3 className="text-lg font-semibold mb-4">Pay with PayPal</h3>
                <PayPalButton
                  amount={parseFloat(cart?.totalPrice).toFixed(2)}
                  onSuccess={handlePaymentSuccess}
                  onError={(err) => alert(`Payment Failed: ${err.message}`)}
                />
              </div>
            )}
          </div>
        </form>
      </div>
      {/* Right Section */}
      <div className="bg-gray-100 p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
        <div className="border-t py-4 mb-4">
          {cart.products?.map((product, idx) => (
            <div key={idx} className="flex items-start justify-between py-2 border-b">
              <div className="flex items-start">
                <img
                  className="w-20 h-20 object-cover mr-4"
                  src={product.images}
                  alt={product.name}
                />
                <div>
                  <h3 className="text-md font-medium">{product.name}</h3>
                  <p className="text-gray-500">Size: {product.size}</p>
                  <p className="text-gray-500">Color: {product.color}</p>
                </div>
              </div>
              <p className="text-xl">₹{product.price?.toLocaleString()}</p>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center text-lg mb-4">
          <p>Subtotal</p>
          <p>₹{cart.totalPrice?.toLocaleString()}</p>
        </div>
        <div className="flex justify-between items-center text-lg">
          <p>Shipping</p>
          <p>Free</p>
        </div>
        <div className="flex justify-between items-center text-lg mt-4 border-t pt-4 font-bold">
          <p>Total</p>
          <p>₹{cart.totalPrice?.toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default CheckOut;