import { configureStore } from '@reduxjs/toolkit';
import userReducer from './features/user/userSlice';

type StoreOptions = {
  preloadedState: any;
}

export function setupStore(options?: StoreOptions) {
  return configureStore({
    preloadedState: options?.preloadedState,
    reducer: {
      user: userReducer,
    },
  });
}
