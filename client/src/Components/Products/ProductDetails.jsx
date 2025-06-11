import { useEffect, useState } from "react";
import { toast } from "sonner";
import ProductGrid from "./ProductGrid";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProductDetails,
  fetchSimilarProducts,
} from "../../Redux/Slice/ProductSlice";
import { addToCart } from "../../Redux/Slice/cartSlice";

const ProductDetails = ({ productId }) => {
  const { id } = useParams();

  const dispatch = useDispatch();
  const { selectedProducts, similarProducts, loading, error } = useSelector(
    (state) => state.products
  );

  const { user, guestId } = useSelector((state) => state.auth);
  const [mainImg, setMainImg] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isDisabledBtn, setIsDisabledBtn] = useState(false);
  // console.log(quantity);

  const productFetchId = productId || id;
  //   console.log("ID: ", productFetchId);

  useEffect(() => {
    if (productFetchId) {
      dispatch(fetchProductDetails(productFetchId));
      dispatch(fetchSimilarProducts({ id: productFetchId }));
    }
  }, [dispatch, productFetchId]);

  useEffect(() => {
    if (selectedProducts?.images?.length > 0) {
      setMainImg(selectedProducts?.images[0]?.url);
    }
  }, [selectedProducts?.images]);

  const handleAddToCart = () => {
    if ((!selectedColor || !selectedSize)) {
      toast.error("Please select a size and color before adding to cart!", {
        duration: 1000,
      });
      return;
    }
    // Prevent action if button is already disabled
    if (isDisabledBtn) return;

    setIsDisabledBtn(true);

    dispatch(
      addToCart({
        productId: productFetchId,
        quantity,
        sizes: selectedSize,
        colors: selectedColor,
        guestId,
        userId: user?._id,
      })
    )
      .then(() => {
        toast.success("Product added to cart!", {
          duration: 1000,
        });
      })
      .finally(() => {
        setIsDisabledBtn(false);
      });
  };

  if (loading) {
    return <p className="text-center w-full">Loading products...</p>;
  }

  if (error) {
    return <p className="text-center text-red-500 w-full">Error: {error}</p>;
  }
  console.log(selectedProducts)
  return (
    <section className="p-6">
      {selectedProducts && (
        <div className="max-w-5xl bg-white rounded-lg mx-auto p-8 shadow">
          <div className="flex flex-col md:flex-row">
            {/* Left Thumbnails */}
            <div className="hidden md:flex flex-col space-y-4 mr-6">
              {selectedProducts?.images?.map((img, idx) => (
                <img
                  key={idx}
                  className=" w-20 h-20 object-cover rounded-lg cursor-pointer"
                  src={img?.url}
                  alt={img?.altText || `Thumbnail ${idx}`}
                  onClick={() => setMainImg(img?.url)}
                />
              ))}
            </div>
            {/* Main Image */}
            <div className="md:w-1/2">
              <div className="mb-4 h-full">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={mainImg}
                  alt="Main Product"
                />
              </div>
            </div>
            {/* Mobile Thumbnails */}
            <div className="flex md:hidden space-x-4 mr-6">
              {selectedProducts?.images?.map((img, idx) => (
                <img
                  key={idx}
                  className="w-20 h-20 object-cover rounded-lg"
                  src={img?.url}
                  alt={img?.altText || `Thumbnail ${idx}`}
                  onClick={() => setMainImg(img?.url)}
                />
              ))}
            </div>
            {/* Right Side */}
            <div className="md:w-1/2 md:ml-10">
              <h1 className="text-2xl md:text-3xl font-semibold mb-2">
                {selectedProducts?.name}
              </h1>
              {/* Original Price */}
              <div className="text-lg text-gray-600  mb-1">
                ₹{" "}
                <span className="line-through">
                  {selectedProducts?.originalPrice &&
                    `${selectedProducts?.originalPrice}`}
                </span>
              </div>
              {/* Selling Price */}
              <p className="text-xl text-gray-500 mb-2">
                ₹ {selectedProducts?.price && `${selectedProducts?.price}`}
              </p>
              {/* Description */}
              <p className="text-gray-600 mb-4">
                {selectedProducts?.description}
              </p>
              {/* Colors */}
              <div className="mb-4">
                <p className="text-gray-700">Color:</p>
                <div className="flex gap-2 mt-2">
                  {selectedProducts?.colors?.map((color) => (
                    <button
                      key={color}
                      className={`btn w-8 h-8 rounded-full border-0 shadow-none ${
                        selectedColor === color ? "outline-1" : ""
                      }`}
                      style={{
                        backgroundColor: color.toLocaleLowerCase(),
                        filter: "brightness(0.5)",
                      }}
                      onClick={() => setSelectedColor(color)}
                    ></button>
                  ))}
                </div>
              </div>
              {/* size */}
              <div className="mb-4">
                <p className="text-gray-700">Size: </p>
                <div className="flex gap-2 mt-2">
                  {selectedProducts?.sizes?.map((sizes) => (
                    <button
                      key={sizes}
                      className={`btn w-8 h-8 border-0 bg-main-theme ${
                        selectedSize === sizes ? "bg-success" : ""
                      }`}
                      onClick={() => setSelectedSize(sizes)}
                    >
                      {sizes}
                    </button>
                  ))}
                </div>
              </div>
              {/* Quantity */}
              <div className="mb-6">
                <p className="text-gray-600">Quantity: </p>
                <div className="flex items-center space-x-4 mt-2">
                  <button
                    className="btn w-8 h-8 border-0 bg-main-theme"
                    onClick={() => {
                      if (quantity <= 0) return quantity;
                      setQuantity((prev) => prev - 1);
                    }}
                  >
                    -
                  </button>
                  <span className="">{quantity}</span>
                  <button
                    className="btn w-8 h-8 border-0 bg-main-theme"
                    onClick={() => setQuantity((prev) => prev + 1)}
                  >
                    +
                  </button>
                </div>
              </div>
              {/* Add Cart */}
              <button
                onClick={handleAddToCart}
                className={`btn w-full border-0 bg-main-theme ${
                  isDisabledBtn ? "cursor-not-allowed opacity-50" : ""
                }`}
              >
                {isDisabledBtn ? (
                  <div className="">
                    <span className="loading"></span>
                    Adding...
                  </div>
                ) : (
                  "Add To Cart"
                )}
              </button>
              {/* Characteristics */}
              <div className="mt-10 text-gray-700">
                <h3 className="text-xl font-bold mb-4">Characteristics: </h3>
                <table className="table text-sm text-gray-600">
                  <tbody className="">
                    <tr>
                      <td className="py-1">Brand: </td>
                      <td className="py-1">{selectedProducts?.brand}</td>
                    </tr>
                    <tr>
                      <td className="py-1">Material: </td>
                      <td className="py-1">{selectedProducts?.material}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* Top wear */}
          <div className="mt-20">
            <h2 className="text-2xl text-center font-bold mb-4">
              You May Also Like
            </h2>
            <ProductGrid Products={similarProducts} loading={loading} error={error} />
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductDetails;
