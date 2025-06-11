import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { fetchOrderDetails } from "../Redux/Slice/orderSlice";

const OrderDetailsPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrderDetails(id));
  }, [dispatch, id]);

  if (loading)
    return (
      <div className="">
        <span className="loading"></span>
        <span className="">Loading....</span>
      </div>
    );
  if (error)
    return (
      <div className="">
        <span className="">Error : {error}</span>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-4">
      <h2 className="text-2xl md:text-2xl font-bold mb-6">Order Details</h2>
      {!orderDetails ? (
        <p className="">No Order Details Found</p>
      ) : (
        <div className="rounded-lg p-4 sm:p-6 border">
          {/* Order Info */}
          <div className="flex flex-col sm:flex-row justify-between mb-8">
            <div className="">
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID: #{orderDetails?._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createAt).toLocaleDateString()}
              </p>
            </div>
            <div className="flex flex-col items-center sm:items-end mt-4 sm:mt-0">
              <span
                className={`${
                  orderDetails?.isPaid
                    ? "bg-success-content text-success"
                    : "bg-error-content text-error"
                } rounded-full text-sm font-medium mb-2 px-2 py-1`}
              >
                {orderDetails?.isPaid ? "Approved" : "Pending"}
              </span>
              <span
                className={`${
                  orderDetails?.isDelivered
                    ? "bg-success-content text-success"
                    : "bg-warning-content text-warning"
                } rounded-full text-sm font-medium mb-2 px-2 py-1`}
              >
                {orderDetails?.isDelivered ? "Delivered" : "Pending"}
              </span>
            </div>
          </div>
          {/* Customer, Payment, Shipping */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Payment Info</h4>
              <p className="">Payment Method: {orderDetails.paymentMethod}</p>
              <p className="">
                Status: {orderDetails.isPaid ? "Paid" : "Unpaid"}
              </p>
            </div>
            <div className="">
              <h4 className="text-lg font-semibold mb-2">Shipping Info</h4>
              <p className="">Shipping Method: {orderDetails.shippingMethod}</p>
              <p className="">
                Address:{""}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.country}`}
              </p>
            </div>
          </div>
          {/* Product list */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4">Products</h4>
            <table className="table">
              <thead className="bg-gray-100 text-black">
                <tr>
                  <th className="">Name</th>
                  <th className="">Unit Price</th>
                  <th className="">Quantity</th>
                  <th className="">Total</th>
                </tr>
              </thead>
              <tbody className="">
                {orderDetails.orderItems.map((items) => (
                  <tr key={items.productId} className="border-b">
                    <td className="flex items-center py-2 px-4">
                      <img
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                        src={items.images}
                        alt={items.name}
                      />
                      <Link
                        to={`/product/${items.productId}`}
                        className="text-primary hover:underline"
                      >
                        {items.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4">₹{items.price}</td>
                    <td className="py-2 px-4">₹{items.quantity}</td>
                    <td className="py-2 px-4">
                      ₹{items.price * items.quantity}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Back to order Link */}
          <Link to="/my-order" className="text-info hover:underline">
            Back to my orders
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrderDetailsPage;
