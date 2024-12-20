import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { contentService } from '../../utils/axiosInstances';


// Thunk to fetch featured news
export const fetchFeaturedNews = createAsyncThunk('featuredNews/fetchFeaturedNews', async () => {
  const response = await contentService.get(`/api/v1/content/news/featured`);  // Adjust API endpoint as needed
  return response.data;
});

const featuredNewsSlice = createSlice({
  name: 'featuredNews',
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeaturedNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFeaturedNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchFeaturedNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default featuredNewsSlice.reducer;
