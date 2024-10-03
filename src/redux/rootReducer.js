import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import taskReducer from './slices/taskSlice';
import taxonomyReducer from './slices/taxonomySlice';

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: taskReducer,
  taxonomy: taxonomyReducer,
});

export default rootReducer;