import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';


const initialState = {
  user: [],
  token: Cookies.get('token') || null,
  status: 'idle',
  error: null,
};

export const signup = createAsyncThunk('user/signup', async (userData) => {
  const response = await axios.post(' http://127.0.0.1:8000/users', userData);
  return response.data;
});

export const login = createAsyncThunk(
  'user/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://127.0.0.1:8000/users/login', { email, password });
      const { access_token} = response.data;

      // Store the token in a cookie
      Cookies.set('token', access_token, { expires: 1 }); // Expires in 1 day

      return {access_token};
    } catch (error) {
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data);
      } else {
        return rejectWithValue({ detail: 'An unexpected error occurred' });
      }
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      
      Cookies.remove('token');
    },
    resetStatus(state) {
      state.status = 'idle';}
  },
  extraReducers: (builder) => {
    builder
      .addCase(signup.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(signup.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload;
      })
      .addCase(signup.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.token = action.payload.access_token;
       
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload.detail;
      });
  },
});


export default userSlice.reducer;
export const {logout,resetStatus} = userSlice.actions;
