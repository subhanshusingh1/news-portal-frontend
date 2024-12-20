// newsImageSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async action for uploading news images
export const uploadNewsGallery = createAsyncThunk(
  'news/uploadNewsGallery',
  async ({ newsId, formData }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/api/news/${newsId}/upload-gallery`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const initialState = {
  profileImage: [],
  loading: false,
  error: null,
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
        state.profileImage = action.payload.profileImage;
        state.error = null;
      })
      .addCase(uploadNewsGallery.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetImageState } = newsImageSlice.actions;
export default newsImageSlice.reducer;
