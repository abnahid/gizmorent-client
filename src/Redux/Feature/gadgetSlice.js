import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL = "https://gizmorent-server.vercel.app/gadgets";

// Fetch all gadgets 
export const fetchGadgets = createAsyncThunk(
  "gadgets/fetchGadgets",
  async ({ query = "", category = "", minPrice = 0, maxPrice = 999999, sortOption = "Default", page = 1 }) => {
    try {
      const response = await axios.get(
        `https://gizmorent-server.vercel.app/gadgets/search?query=${query}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}&sort=${sortOption}&page=${page}`
      );
      return response.data; // Ensure that your API returns { gadgets, currentPage, totalPages }
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch gadgets");
    }
  }
);

// Fetch a single gadget
export const fetchGadgetDetails = createAsyncThunk(
  "gadgets/fetchGadgetDetails",
  async (id) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || "Failed to fetch gadget details");
    }
  }
);

const gadgetSlice = createSlice({
  name: "gadgets",
  initialState: {
    gadgets: [],
    gadgetDetails: {},
    loading: false,
    error: null,
    filters: {
      query: "",
      category: "",
      minPrice: 0,
      maxPrice: Infinity,
      sortOption: "Default",
    },
    pagination: {
      currentPage: 1,
      totalPages: 1,
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setPagination: (state, action) => {
      state.pagination = { ...state.pagination, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGadgets.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGadgets.fulfilled, (state, action) => {
        state.loading = false;
        state.gadgets = action.payload.gadgets;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchGadgets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchGadgetDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGadgetDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.gadgetDetails = action.payload; // Store gadget details properly
      })
      .addCase(fetchGadgetDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
      
  },
});

export const { setFilters, setPagination } = gadgetSlice.actions;
export default gadgetSlice.reducer;
