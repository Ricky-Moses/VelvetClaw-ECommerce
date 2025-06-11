import { Link } from 'react-router-dom';

const ProductGrid = ({ Products, loading, error }) => {
  if (loading) {
    return (
    <div className="text-center w-full">
      <span className="loading"></span>
      <span className="">Loading products...</span>
    </div>)
  }

  if (error) {
    return <p className="text-center text-red-500 w-full">Error: {error}</p>;
  }

  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {Products.map((product, idx) => (
        <Link key={idx} to={`/product/${product?._id}`} className="block">
          <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition">
            <div className="w-full h-96 mb-4 overflow-hidden rounded-2xl">
              <img
                className="w-full h-full object-cover object-center"
                src={product?.images[0]?.url}
                alt={product?.images[0]?.altText || product?.name}
              />
            </div>
            <h3 className="text-sm font-medium mb-2">{product?.name}</h3>
            <p className="text-gray-500 font-medium text-sm tracking-tighter">₹ {product?.price}</p>
          </div>
        </Link>
      ))}
    </section>
  );
};

export default ProductGrid;
