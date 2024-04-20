import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { userCompanyList, userLogin } from "../thunk/user";

const initialState = {
    userDetails: null,
    companyList: [],
    selectedCompany: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        resetUserDetails: (state, action) => {
            return initialState;
        },
        setSelectedCompany: (state, action) => {
            return {
                ...state,
                selectedCompany: action.payload
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state, action) => {
            state.userDetails = null;
        }).addCase(userLogin.fulfilled, (state, action) => {
            // state.userDetails = action.payload;
            const data = action.payload?.data;
            state.userDetails = JSON.stringify(data);
            toast.success('Logged in successfully.');
            console.log("@@@ ROLE: ", data);
            localStorage.setItem('token', data.accessToken);
            localStorage.setItem('user', JSON.stringify(data.user));
        }).addCase(userLogin.rejected, (state, action) => {
            state.userDetails = null;
            console.log("!!!! LOGIN ERROR: ", action.payload);
        })

        builder.addCase(userCompanyList.pending, (state, action) => {
            state.companyList = [];
        }).addCase(userCompanyList.fulfilled, (state, action) => {
            const data = action.payload?.data;
            state.companyList = data;
            console.log("^^^ CMPNY LIST SUCCESS: ", data);
        }).addCase(userCompanyList.rejected, (state, action) => {
            state.companyList = [];
            console.log("!!!! CMPNY LIST ERROR: ", action.payload);
        })
    }
});

export const userActions = userSlice.actions;

export default userSlice;