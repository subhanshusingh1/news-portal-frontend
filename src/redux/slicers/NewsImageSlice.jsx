import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { contentService } from '../../utils/axiosInstances';

// Async action for uploading news images
export const uploadNewsGallery = createAsyncThunk(
  'news/uploadNewsGallery',
  async ({ newsId, formData }, { rejectWithValue }) => {
    try {
      const response = await contentService.post(`/api/v1/content/news/upload-news-gallery/${newsId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data || 'Failed to upload image');
    }
  }
);

const initialState = {
  profileImage: [], // Store the uploaded image details (e.g., URL)
  loading: false,    // Track the loading state
  error: null,       // Track any error during the image upload
};

const newsImageSlice = createSlice({
  name: 'newsImage',
  initialState,
  reducers: {
    resetImageState: (state) => {
      state.profileImage = [];
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadNewsGallery.pending, (state) => {
        state.loading = true;
      })
      .addCase(uploadNewsGallery.fulfilled, (state, action) => {
        state.loading = false;
        state.profileImage = action.payload.profileImage; // Assuming the API returns an image URL or other details
        state.error = null;
      })
      .addCase(uploadNewsGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to upload image';
      });
  },
});

export const { resetImageState } = newsImageSlice.actions;
export default newsImageSlice.reducer;
