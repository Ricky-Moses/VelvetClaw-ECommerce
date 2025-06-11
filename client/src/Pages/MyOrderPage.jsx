import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchUserOrders } from "../Redux/Slice/orderSlice";

const MyOrderPage = () => {
  const dispatch = useDispatch();
  const { orders, loading, error } = useSelector((state) => state.orders);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchUserOrders());
  }, [dispatch]);

  const handleRowClick = (orderID) => {
    navigate(`/order/${orderID}`);
  };

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
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-xl sm:text-2xl font-bold mb-6">My Orders</h2>
      <div className="relative shadow-md sm:rounded-lg overflow-hidden">
        <table className="table min-w-full">
          <thead className="bg-gray-200 text-black">
            <tr>
              <th className="py-2 px-4 sm:py-3">Image</th>
              <th className="py-2 px-4 sm:py-3">Order ID</th>
              <th className="py-2 px-4 sm:py-3">Created</th>
              <th className="py-2 px-4 sm:py-3">Shipping Address</th>
              <th className="py-2 px-4 sm:py-3">Items</th>
              <th className="py-2 px-4 sm:py-3">Price</th>
              <th className="py-2 px-4 sm:py-3">Status</th>
            </tr>
          </thead>
          <tbody className="">
            {orders.length > 0 ? (
              orders?.map((order) => (
                <tr
                  onClick={() => handleRowClick(order._id)}
                  key={order._id}
                  className="cursor-pointer"
                >
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <img
                      className="w-10 h-10 sm:w-12 sm:h-12 object-cover rounded-lg"
                      src={order?.orderItems[0]?.images}
                      alt={order?.orderItems[0]?.name}
                    />
                  </td>
                  <td className="font-medium text-gray-900 sm:px-2 py-2 sm:py-4 whitespace-nowrap">
                    #{order?._id}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {new Date(order?.createAt).toLocaleDateString()} |{" "}
                    {new Date(order?.createAt).toLocaleTimeString()}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order?.shippingAddress
                      ? `${order?.shippingAddress?.city}, ${order?.shippingAddress.country}`
                      : `N/A`}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    {order?.orderItems?.length}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    ₹{order?.totalPrice}
                  </td>
                  <td className="py-2 px-2 sm:py-4 sm:px-4">
                    <span
                      className={`${
                        order?.isPaid
                          ? "bg-success-content text-success"
                          : "bg-error-content text-error"
                      } px-2 py-1 rounded-full sm:text-sm font-medium`}
                    >
                      {order?.isPaid ? "Paid" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="text-center text-gray-500 py-4 px-4">
                  You have no orders
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MyOrderPage;
