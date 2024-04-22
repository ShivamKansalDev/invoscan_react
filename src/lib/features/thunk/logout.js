import { createAsyncThunk } from "@reduxjs/toolkit";

export const logout = createAsyncThunk("user/logout", async(data, thunkAPI) => {
    try{
        return null;
    }catch(error){
        return thunkAPI.rejectWithValue(error);
    }
});