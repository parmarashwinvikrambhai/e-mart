import { createSlice } from "@reduxjs/toolkit";

interface CartItem {
    productId: { _id: string; name: string; price: number; image: string };
    size: string;
    quantity: number;
}


interface CartState {
    items: CartItem[];
}

const initialState: CartState = {
    items: [],
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart(state, action) {
            const existingItem = state.items.find(
                item => item.productId === action.payload.productId && item.size === action.payload.size
            );

            if (existingItem) {
                existingItem.quantity += action.payload.quantity;
            } else {
                state.items.push(action.payload);
            }
        },

        removeFromCart(state, action) {
            state.items = state.items.filter(
                (item) => item.productId !== action.payload
            );
        },
        clearCart(state) {
            state.items = [];
        },
        setCart(state, action) {
            state.items = action.payload; 
        },
    },
});

export const { addToCart, removeFromCart, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;
