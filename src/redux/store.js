import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/authSlice';
import rootReducer from './rootReducer';

const store = configureStore({
  reducer: {
    auth: authReducer,
    tasks: taskReducer,
    rootReducer
  },
});

export default store;
