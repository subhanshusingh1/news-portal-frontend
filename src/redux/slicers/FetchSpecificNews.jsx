// src/redux/slicers/SpecificNewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { contentService } from '../../utils/axiosInstances';

// Create an async thunk to fetch specific news by its ID
export const fetchSpecificNews = createAsyncThunk(
  'news/fetchSpecificNews',
  async (newsId, { rejectWithValue }) => {
    try {
      const response = await contentService.get(`/api/v1/content/news/${newsId}`);
      return response.data; // Return the fetched data
    } catch (error) {
      return rejectWithValue(error.response.data); // In case of an error, return the error message
    }
  }
);

// Create the slice
const specificNewsSlice = createSlice({
  name: 'specificNews',
  initialState: {
    news: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecificNews.pending, (state) => {
        state.loading = true; // Set loading to true when request is sent
      })
      .addCase(fetchSpecificNews.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when request is successful
        state.news = action.payload; // Save the news data in the state
        state.error = null; // Reset any error state
      })
      .addCase(fetchSpecificNews.rejected, (state, action) => {
        state.loading = false; // Set loading to false when request fails
        state.error = action.payload; // Save the error in the state
      });
  },
});

export default specificNewsSlice.reducer;

