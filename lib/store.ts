import { configureStore } from '@reduxjs/toolkit';
import { combineReducers } from '@reduxjs/toolkit';
import { authApi } from './api/authApi';
import authSlice from './slices/authSlice';
import cartSlice from './slices/cart/reducer';
import { attachStore } from './axios';

// Root reducer
const rootReducer = combineReducers({
  auth: authSlice,
  cart: cartSlice,
  [authApi.reducerPath]: authApi.reducer,
});

// Configure store
export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [],
      },
    }).concat(authApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

// Attach store to axios lazily to avoid circular imports
attachStore(store);

// Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
