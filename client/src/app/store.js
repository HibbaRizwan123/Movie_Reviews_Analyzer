import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/user/userSlice'
import sentimentReducer from '../features/sentiment/sentimentSlice'

export const store = configureStore({
  reducer: {
    user: userReducer,
    sentiment: sentimentReducer
  },
});
