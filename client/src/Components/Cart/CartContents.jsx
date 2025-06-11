import { FaRegTrashAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import {
  removeFromCart,
  updateCartItemQuantity,
} from "../../Redux/Slice/cartSlice";

const CartContents = ({ cart, userId, guestId }) => {
  const dispatch = useDispatch();

  // Handle adding or subtracting to cart
  const handleAddToCart = (productId, delta, quantity, sizes, colors) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1) {
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          sizes,
          colors,
        })
      );
    }
  };

  const handleRemoveFromCart = (productId, sizes, colors) => {
    dispatch(removeFromCart({ productId, guestId, userId, sizes, colors }));
  };
  return (
    <div>
      {cart?.products.map((products, idx) => (
        <div
          key={idx}
          className="flex items-start justify-between border-b !py-4"
        >
          <div className="flex items-start gap-2">
            <img
              className="w-20 h-20 object-cover rounded-2xl"
              src={products?.images}
              alt={products?.name}
            />
            <div className="">
              <h3 className="">{products?.name}</h3>
              <p className="">
                Size: {products?.sizes} | Color: {products?.colors}
              </p>
              <div className="flex items-center gap-3 !mt-2">
                <button
                  type="button"
                  className="btn w-5 h-8 bg-transparent hover:!bg-main-theme hover:!text-white border border-main-theme shadow-none text-black text-xl"
                  onClick={() =>
                    handleAddToCart(
                      products.productId,
                      -1,
                      products.quantity,
                      products.sizes,
                      products.colors
                    )
                  }
                >
                  -
                </button>
                <span className="">{products?.quantity}</span>
                <button
                  type="button"
                  className="btn w-5 h-8 bg-transparent hover:!bg-main-theme hover:!text-white border border-main-theme shadow-none text-black text-xl"
                  onClick={() =>
                    handleAddToCart(
                      products.productId,
                      +1,
                      products.quantity,
                      products.sizes,
                      products.colors
                    )
                  }
                >
                  +
                </button>
              </div>
            </div>
          </div>
          <div className="">
            <p className="">₹ {products?.price?.toLocaleString()}</p>
            <button
            onClick={() => handleRemoveFromCart(
                products.productId,
                products.sizes,
                products.colors
            )}
            className="btn bg-transparent border-0 shadow-none">
              <FaRegTrashAlt className=" text-main-theme text-lg" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CartContents;
