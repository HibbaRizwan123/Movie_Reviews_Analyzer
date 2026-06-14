
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const predictSentiment = createAsyncThunk(
  'sentiment/predictSentiment',
  async ({ review, token }, { rejectWithValue }) => {
    try {
      const response = await fetch('http://localhost:8000/dashboard/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,  // Include the JWT token here
        },
        body: JSON.stringify({ review }),
      });

      if (!response.ok) {
        throw new Error('Failed to predict sentiment');
      }

      const data = await response.json();
      return data.sentiment_scores;  
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const sentimentSlice = createSlice({
  name: 'sentiment',
  initialState: {
    sentimentScores: null,
    status: 'idle',
    error: null,
  },
  reducers: {
    resetSentiment: (state) => {
      state.sentimentScores = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(predictSentiment.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(predictSentiment.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.sentimentScores = action.payload;
      })
      .addCase(predictSentiment.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Failed to predict sentiment';
      });
  },
});

export const { resetSentiment } = sentimentSlice.actions;

export default sentimentSlice.reducer;
