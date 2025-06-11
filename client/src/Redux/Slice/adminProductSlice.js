
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = import.meta.env.VITE_BACKEND_URL;
const getUserToken = () => `Bearer ${localStorage.getItem("userToken")}`;

// Async thunk to fetch admin products
export const fetchAdminProducts = createAsyncThunk(
  "adminProducts/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/api/products`, {
        headers: {
          Authorization: getUserToken(),
        },
      });
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        err.message ||
        "Failed to fetch products";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async function to create a new product
export const createProducts = createAsyncThunk(
  "adminProducts/createProducts",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${API_URL}/api/products`,
        productData,
        {
          headers: {
            Authorization: getUserToken(),
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        err.message ||
        "Failed to create product";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to update an existing product
export const updateProducts = createAsyncThunk(
  "adminProducts/updateProducts",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.put(
        `${API_URL}/api/products/${id}`,
        productData,
        {
          headers: {
            Authorization: getUserToken(),
          },
        }
      );
      return response.data;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        err.message ||
        "Failed to update product";
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk to delete an existing product
export const deleteProducts = createAsyncThunk(
  "adminProducts/deleteProducts",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/api/products/${id}`, {
        headers: {
          Authorization: getUserToken(),
        },
      });
      return id;
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.join(", ") ||
        err.message ||
        "Failed to delete product";
      return rejectWithValue(errorMessage);
    }
  }
);

// Slice
const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    createLoading: false,
    error: null,
    createError: null,
  },
  reducers: {
    clearCreateError: (state) => {
      state.createError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin products
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
        state.error = null;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create products
      .addCase(createProducts.pending, (state) => {
        state.createLoading = true;
        state.createError = null;
      })
      .addCase(createProducts.fulfilled, (state, action) => {
        state.createLoading = false;
        state.products.push(action.payload);
        state.createError = null;
      })
      .addCase(createProducts.rejected, (state, action) => {
        state.createLoading = false;
        state.createError = action.payload;
      })
      // Update products
      .addCase(updateProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProducts.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        state.error = null;
      })
      .addCase(updateProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete products
      .addCase(deleteProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.error = null;
      })
      .addCase(deleteProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCreateError } = adminProductSlice.actions;
export default adminProductSlice.reducer;
