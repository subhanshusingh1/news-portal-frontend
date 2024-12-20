import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { contentService } from '../../utils/axiosInstances';

// Async thunk to call the controller and fetch news
export const fetchNewsForSubscribedRegions = createAsyncThunk(
  'editorPicNews/fetchNewsForSubscribedRegions',
  async (clerkUserId) => {
    try {
      const response = await contentService.get(
        `/api/v1/content/news/subscribed`, // Adjust this endpoint as needed
        { params: { clerkUserId } }
      );

      if (!response.data || !response.data.length) {
        throw new Error('No approved news found for your subscribed regions.');
      }

      return response.data; // Returning the simplified news data
    } catch (error) {
      throw new Error(error.response ? error.response.data.message : error.message);
    }
  }
);

// Slice for managing news data
const editorPicNewsSlice = createSlice({
  name: 'editorPicNews',
  initialState: {
    news: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsForSubscribedRegions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNewsForSubscribedRegions.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchNewsForSubscribedRegions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

// Export the actions and the reducer
export default editorPicNewsSlice.reducer;
