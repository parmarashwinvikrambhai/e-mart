import { createSlice} from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";


interface User {
    _id: string;
    name: string;
    email: string;
    isAdmin: boolean;
}

interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

const initialState: AuthState = {
    user: null,
    isAuthenticated: false,
};

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.isAuthenticated = true;
        },
        logoutUser: (state) => {
            state.user = null;
            state.isAuthenticated = false;
        }
    },
});

export const { setUser, logoutUser } = authSlice.actions;
export default authSlice.reducer;
