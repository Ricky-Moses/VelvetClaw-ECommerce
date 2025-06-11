import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./Slice/authSlice";
import productReducer from "./Slice/ProductSlice";
import cartReducer from "./Slice/cartSlice";
import checkoutReducer from './Slice/checkoutSlice'
import orderReducer from './Slice/orderSlice'
import adminReducer from './Slice/adminSlice'
import adminProductReducer from './Slice/adminProductSlice'
import adminOrderReducer from './Slice/adminOrderSlice'

const Store = configureStore({
  reducer: {
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    checkout: checkoutReducer,
    orders: orderReducer,
    admin: adminReducer,
    adminProduct: adminProductReducer,
    adminOrder: adminOrderReducer
  },
});

export default Store;
