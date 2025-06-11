import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { FaRegUser } from "react-icons/fa";
import { MdOutlineShoppingCart } from "react-icons/md";
import { BsSearch } from "react-icons/bs";
import SearchBar from "./SearchBar";
import CartDrawer from "../Layouts/CartDrawer";
import { useSelector } from "react-redux";

const NavBar = () => {
  const [drawerOpen, isDrawerOpen] = useState(false);
  const { cart } = useSelector(state => state.cart);
  const { user } = useSelector(state => state.auth);
  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleDrawer = () => {
    isDrawerOpen(!drawerOpen);
  };

  return (
    <>
      <nav className="container relative flex flex-col md:flex-row items-center justify-between gap-5 lg:gap-0 !mx-auto !py-4 !px-3 lg:!px-6">
        {/* E-Commerce Name */}
        <div className="col1">
          <Link
            to="/"
            className="text-2xl font-bold text-main-theme small-caps"
          >
            {" "}
            VelvetClaw{" "}
          </Link>
          {/* VelvetClaw - Softness + strength — velvet for elegance, claw for raw power */}
        </div>
        {/* Center Nav Link */}
        <div className="col2 items-center space-x-4 sm:space-x-6">
          <NavLink
            to="/collections/all?gender=Men"
            className={({ isActive }) => (isActive ? "text-main-theme" : "")}
          >
            Men
          </NavLink>
          <NavLink
            to="/collections/all?gender=Women"
            className={({ isActive }) => (isActive ? "text-main-theme" : "")}
          >
            Women
          </NavLink>
          <NavLink
            to="/collections/all?category=Top Wear"
            className={({ isActive }) => (isActive ? "text-main-theme" : "")}
          >
            Top Wear
          </NavLink>
          <NavLink
            to="/collections/all?category=Bottom Wear"
            className={({ isActive }) => (isActive ? "text-main-theme" : "")}
          >
            Bottom Wear
          </NavLink>
        </div>
        {/* Right Icons */}
        <div className="col3 flex items-center gap-10">
          {user && user.role === "admin" && (
            <button className="btn !h-7 px-2 border-0 bg-main-theme">
              <Link className="block text-white !" to="/admin">
                Admin
              </Link>
            </button>
          )}
          <Link to="/profile">
            <FaRegUser className="w-5 h-5 text-gray-500" />
          </Link>
          {/* Cart Icon */}
          <div className="indicator">
            <span className="indicator-item badge bg-main-theme border-0 -right-1 !p-2">
              {cartItemCount}
            </span>
            <span
              onClick={toggleDrawer}
              className=" bg-transparent border-0 shadow-none"
            >
              <MdOutlineShoppingCart className="w-6 h-6 text-gray-500 cursor-pointer" />
            </span>
          </div>
          {/* Search Bar */}
          <div className="overflow-hidden">
            <SearchBar />
          </div>
        </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleDrawer={toggleDrawer} />
    </>
  );
};

export default NavBar;
