import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const addToCart = createAsyncThunk(
  "cart/addToCart",
  async ({ gadget, email, quantity }) => {
    try {
      const response = await fetch("https://gizmorent-server.vercel.app/cartlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gadgetId: gadget._id,
          name: gadget.name,
          image: gadget.image,
          price: gadget.price,
          category: gadget.category,
          renterId:gadget.renterId,
          email,
          quantity,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add to cart");
      }

      const data = await response.json();
      console.log("Item added to cart:", data);

      return data;
    } catch (error) {
      console.error("Error adding item to cart:", error);
      throw error;
    }
  }
);

// Fetch cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async (email) => {
  const response = await fetch(`https://gizmorent-server.vercel.app/cartlist?email=${email}`);
  const data = await response.json();
  return Array.isArray(data) ? data : [];
});

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async (_id) => {
    const response = await fetch(`https://gizmorent-server.vercel.app/cartlist/${_id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to remove from cart");
    }

    return _id;
  }
);

// Update quantity
export const updateCartQuantity = createAsyncThunk(
  "cart/updateCartQuantity",
  async ({ _id, userEmail, quantity }) => {
    const response = await fetch(`https://gizmorent-server.vercel.app/cartlist/${_id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userEmail, quantity }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to update quantity");
    }

    return await response.json();
  }
);

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    status: "idle",
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      // Add to Cart
      .addCase(addToCart.fulfilled, (state, action) => {
        const existingItem = state.items.find(
          (item) => item._id === action.payload._id
        );
        if (existingItem) {
          existingItem.quantity += 1;
        } else {
          state.items.push(action.payload);
        }
      })

      // Remove from Cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = state.items.filter((item) => item._id !== action.payload);
      })

      // Update Quantity
      .addCase(updateCartQuantity.fulfilled, (state, action) => {
        const updatedItem = action.payload;
        const existingItem = state.items.find(
          (item) => item._id === updatedItem._id
        ); // Find the item in the state

        if (existingItem) {
          // Update the item's quantity in the state
          existingItem.quantity = updatedItem.quantity;
        }
      });
  },
});
export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
