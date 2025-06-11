import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCart } from "../Redux/Slice/cartSlice";

const OrderConfirmationPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { checkout } = useSelector((state) => state.checkout);

  useEffect(() => {
    if (checkout && checkout._id) {
      dispatch(clearCart());
      localStorage.removeItem("cart");
    } else {
        navigate("/my-order")
    }
  }, [checkout, dispatch, navigate]);

  const calculatedEstimatedDelivery = (createdAt) => {
    const orderDate = new Date(createdAt);
    orderDate.setDate(orderDate.getDate() + 10); // Add 10 days to the order date
    return orderDate.toLocaleDateString();
  };
  return (
    <div className="max-w-4xl bg-white mx-auto p-6">
      <h1 className="text-4xl font-bold text-center text-success mb-8">
        Thank You For Your Order!
      </h1>
      {checkout && (
        <div className="p-6 rounded-lg border border-gray-300">
          <div className="flex justify-between mb-20">
            {/* Order Id */}
            <div className="">
              <h2 className="text-xl font-semibold">
                Order Id: {checkout?._id}
              </h2>
              <p className="text-gray-500">
                Order data: {new Date(checkout.createdAt).toLocaleDateString()}
              </p>
            </div>
            {/* Estimated Delivery */}
            <div className="">
              <p className="text-emerald-700 text-sm">
                Estimated Delivery: {""}
                {calculatedEstimatedDelivery(checkout.createdAt)}
              </p>
            </div>
          </div>
          {/* Ordered Items */}
          <div className="mb-20">
            {checkout.checkoutItems?.map((items) => (
              <div key={items?.productId} className="flex items-center mb-4">
                <img
                  className="w-16 h-16 object-cover rounded-lg mr-4"
                  src={items.images}
                  alt={items.name}
                />
                <div className="">
                  <h4 className="text-md font-semibold">{items.name}</h4>
                  <p className="text-sm text-gray-500">
                    {items.colors} | {items.sizes}
                  </p>
                </div>
                <div className="ml-auto text-right">
                  <p className="text-md">₹{items.price}</p>
                  <p className="text-sm text-gray-500">Qty: {items.quantity}</p>
                </div>
              </div>
            ))}
          </div>
          {/* Payment and Delivery Info */}
          <div className="grid grid-cols-2 gap-8">
            {/* Payment Info */}
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Payment</h4>
              <p className="text-gray-600">PayPal</p>
            </div>
            {/* Delivery Info */}
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Delivery</h4>
              <p className="text-gray-600">
                {checkout.shippingAddress.address}
              </p>
              <p className="text-gray-600">
                {checkout.shippingAddress.city}, {""}
                {checkout.shippingAddress.country}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderConfirmationPage;
