import { configureStore } from '@reduxjs/toolkit'
import userSlice, { userActions } from './features/slice/userSlice'
import loadingSlice, { loadingActions } from './features/slice/loading'

export const makeStore = () => {
  return configureStore({
    reducer: {
      [userSlice.name]: userSlice.reducer,
      [loadingSlice.name]: loadingSlice.reducer
    },
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }),
  })
}

export const logout = () => {
  const store = makeStore();
  store.dispatch(userActions.resetUserDetails());
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  localStorage.removeItem("companyList");
  localStorage.removeItem("company");
}

export const interceptLoading = (value) => {
  const store = makeStore();
  store.dispatch(loadingActions.setLoading(value));
}