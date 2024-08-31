import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    user:{}

  },
  reducers: {
    setLogin:(state,action)=>{
      state.isLoggedIn=action.payload
    },
    setUserInfo:(state,action)=>{
      state.user=action.payload;
    }
  },
});

export const { setLogin,setUserInfo  } = userSlice.actions;
export default userSlice.reducer;