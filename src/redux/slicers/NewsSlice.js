// newsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';


const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Create async thunk for fetching a specific news article
export const fetchSpecificNews = createAsyncThunk(
  'news/fetchSpecificNews',
  async (id) => {
    const response = await axios.get(`http://localhost:8000/api/v1/content/news/${id}`);
    return response.data; // Assuming response.data contains the news article
  }
);

const newsSlice = createSlice({
  name: 'news',
  initialState: {
    news: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSpecificNews.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSpecificNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload;
      })
      .addCase(fetchSpecificNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default newsSlice.reducer;
