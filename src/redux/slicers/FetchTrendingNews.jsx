// src/redux/slicers/TrendingNewsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { contentService } from '../../utils/axiosInstances';


// Async thunk to fetch trending news
export const fetchTrendingNews = createAsyncThunk(
  'news/fetchTrendingNews',
  async (_, { rejectWithValue }) => {
    try {
      const response = await contentService.get(`/api/v1/content/news/trending`);
      return response.data; // Return the trending news data
    } catch (error) {
      return rejectWithValue(error.response.data); // In case of error, return the error message
    }
  }
);

// Create the slice
const trendingNewsSlice = createSlice({
  name: 'trendingNews',
  initialState: {
    news: [],       // Store the list of trending news
    loading: false, // Loading state
    error: null,    // Error state
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTrendingNews.pending, (state) => {
        state.loading = true; // Set loading to true when request is sent
      })
      .addCase(fetchTrendingNews.fulfilled, (state, action) => {
        state.loading = false; // Set loading to false when request is successful
        state.news = action.payload; // Save the trending news data in the state
        state.error = null; // Reset any error state
      })
      .addCase(fetchTrendingNews.rejected, (state, action) => {
        state.loading = false; // Set loading to false when request fails
        state.error = action.payload; // Save the error message in the state
      });
  },
});

export default trendingNewsSlice.reducer;
