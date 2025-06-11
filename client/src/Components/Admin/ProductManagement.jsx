import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import {
  deleteProducts,
  fetchAdminProducts,
} from "../../Redux/Slice/adminProductSlice";

const ProductManagement = () => {
  const dispatch = useDispatch();
  const { products, loading, error } = useSelector(
    (state) => state.adminProduct
  );

  useEffect(() => {
    dispatch(fetchAdminProducts());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete the product")) {
      dispatch(deleteProducts(id));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading"></span>
        <span>Loading...</span>
      </div>
    );
  }

  if (error) return <p className="">Error: {error}</p>;
  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Product Management</h2>
      <div className="overflow-x-auto shadow-md sa:rounded-lg">
        <table className="table min-w-full text-left text-gray-500">
          <thead className="bg-gray-100 text-xs uppercase text-gray-700">
            <tr>
              <th className="py-3 px-4">Name</th>
              <th className="py-3 px-4">Price</th>
              <th className="py-3 px-4">SKU</th>
              <th className="py-3 px-4">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {products.length > 0 ? (
              products?.map((product) => (
                <tr
                  key={product._id}
                  className="border-b hover:bg-gray-50 cursor-pointer"
                >
                  <td className="font-medium text-gray-900 whitespace-nowrap p-4">
                    {product.name}
                  </td>
                  <td className="p-4">{product.price}</td>
                  <td className="p-4">{product.sku}</td>
                  <td className="p-4">
                    <Link to={`/admin/products/${product._id}/edit`}>
                      <button
                        type="button"
                        className="btn btn-soft btn-warning mr-2"
                      >
                        Edit
                      </button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(product._id)}
                      className="btn btn-soft btn-error"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center text-gray-500 p-4">
                  No Products Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductManagement;
