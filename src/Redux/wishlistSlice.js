//for wishlist management
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const addToWishlist = createAsyncThunk("wishlist/addToWishlist", async ({ gadget, email }) => {
  const response = await fetch("https://gizmorent-server.vercel.app/wishlisted", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      gadgetId: gadget._id,
      name: gadget.name,
      image: gadget.image,
      price: gadget.price,
      category: gadget.category,
      renterId: gadget.renterId,
      email,
    }),
  });
  

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to add to wishlist");
  }

  return response.json();
});

export const fetchWishlist = createAsyncThunk("wishlist/fetchWishlist", async (email) => {
  const response = await fetch(`https://gizmorent-server.vercel.app/wishlisted?email=${email}`);
  ;
  return await response.json();
});

// In wishlistSlice.js
export const removeFromWishlist = createAsyncThunk("wishlist/removeFromWishlist", async (id) => {
  const response = await fetch(`https://gizmorent-server.vercel.app/wishlisted/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to remove from wishlist");
  }

  return id; // Return the id so we can filter it from state
});


const wishlistSlice = createSlice({
  name: "wishlist",
  initialState: {
    items: [],
    status: "idle", 
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      });
  },
});

export default wishlistSlice.reducer;

