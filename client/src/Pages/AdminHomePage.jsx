import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import { fetchAdminProducts } from "../Redux/Slice/adminProductSlice"
import { fetchAllOrders } from "../Redux/Slice/adminOrderSlice"

const AdminHomePage = () => {
    const dispatch = useDispatch()
    const {
        products,
        loading: productLoading,
        error: productError
    } = useSelector(state => state.adminProduct)

    const {
        orders,
        totalOrders,
        totalSales,
        loading: orderLoading,
        error: orderError
    } = useSelector(state => state.adminOrder)

    useEffect(() => {
        dispatch(fetchAdminProducts())
        dispatch(fetchAllOrders())
    }, [dispatch])
    return (
        <div className="max-w-7xl mx-auto p-6">
            <h1 className="text-3xl font-bold m-6">Admin Dashboard</h1>
            {productLoading || orderLoading ? (
                <div className="">
                    <span className="">Loading...</span>
                </div>
            ) : productError ? (
                <p className="text-red-600">Error fetching products: {productError}</p>
            ) : orderError ? (
                <p className="text-red-600">Error fetching Order: {orderError}</p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-medium">Revenue</h2>
                    <p className="text-2xl">₹{totalSales.toFixed(2)}</p>
                </div>
                <div className="shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-medium">Total Orders</h2>
                    <p className="text-2xl">{totalOrders}</p>
                    <Link to='/admin/orders' className="">
                        <button className="btn bg-transparent border-0 text-main-theme shadow-none">
                            Manage Orders
                        </button>
                    </Link>
                </div>
                <div className="shadow-md rounded-lg p-4">
                    <h2 className="text-xl font-medium">Total Products</h2>
                    <p className="text-2xl">{products.length}</p>
                    <Link to='/admin/products' className="">
                        <button className="btn bg-transparent border-0 text-main-theme shadow-none">
                            Manage Products
                        </button>
                    </Link>
                </div>
            </div>
            )}
            <div className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
                <div className="overflow-x-auto">
                    <table className="table min-w-full">
                        <thead className="bg-gray-100 text-xs uppercase text-main-theme">
                            <tr>
                                <th className="py-4 px-4">Order ID</th>
                                <th className="py-4 px-4">User</th>
                                <th className="py-4 px-4">Total Price</th>
                                <th className="py-4 px-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <tr key={order._id} className="border-b hover:bg-main-theme/70 hover:text-white cursor-pointer">
                                        <td className="p-4">{order._id}</td>
                                        <td className="p-4">{order.user.name}</td>
                                        <td className="p-4">{order.totalPrice.toFixed(2)}</td>
                                        <td className="p-4">{order.status}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="text-center text-gray-500 p-4">No Recent Orders Founded.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default AdminHomePage