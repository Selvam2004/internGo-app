import { createSlice } from "@reduxjs/toolkit";


const authSlice = createSlice({
    name : "auth",
    initialState : {
        data : null,
        isAuthenticated : false
    },
    reducers:{
        login:(state,action)=>{      
            state.data = action.payload;
            state.isAuthenticated = true;

        },
        logout:(state)=>{
            state.data=null;
            state.isAuthenticated = false
        }
    }
})

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
 