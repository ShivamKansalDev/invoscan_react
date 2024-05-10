"use client";
import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

import { userCompanyList, userLogin } from "../thunk/user";
// import storage from 'redux-persist/lib/storage';
import {storage} from "@/lib/store";
import { logout } from "../thunk/logout";

const initialState = {
    userDetails: null,
    companyList: [],
    selectedCompany: null
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setAuthentication: (state, action) => {
            return Object.assign(state, initialState);
        },
        setUserDetails: (state, action) => {
            return {
                ...state,
                userDetails: action.payload
            }
        },
        setSelectedCompany: (state, action) => {
            return {
                ...state,
                selectedCompany: action.payload
            }
        },
        resetCompanyList: (state, action) => {
            return {
                ...state,
                companyList: []
            }
        }
    },
    extraReducers: (builder) => {
        builder.addCase(userLogin.pending, (state, action) => {
            state.userDetails = null;
        }).addCase(userLogin.fulfilled, (state, action) => {
            const data = action.payload?.data;
            state.userDetails = JSON.stringify(data);
            toast.success('Logged in successfully.');
            storage.setItem('token', data.accessToken);
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
        }).addCase(logout.fulfilled, (state, action) => {
            console.log("^^^^ LOGOUT via THUNK");
            state = Object.assign(state, initialState);
            // Object.assign(state, initialState)
        })
    }
});

export const userActions = userSlice.actions;