import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { contentService } from "../../utils/axiosInstances";

// Async thunk to fetch news by region
export const fetchNewsByRegion = createAsyncThunk(
  "news/fetchNewsByRegion",
  async ({ id }, { rejectWithValue }) => {
    try {
      const response = await contentService.get(
        `/api/v1/content/news/region/${id}`
      );
      return response.data;
    } catch (error) {
      // Return a rejected action with the error message
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch news by region"
      );
    }
  }
);

// Async thunk to create news (modified to support image upload)
export const createNews = createAsyncThunk(
  "news/createNews",
  async (newsData, { rejectWithValue }) => {
    try {
      const formData = new FormData();

      // Capitalize the first letter of regionType if it's defined
      const formattedRegionType =
        newsData.regionType && newsData.regionType.charAt(0).toUpperCase() + newsData.regionType.slice(1);

      // Append basic fields
      formData.append("title", newsData.title.trim());
      formData.append("description", newsData.description);
      formData.append("regionId", newsData.regionId);
      formData.append("regionType", formattedRegionType); // Use the formatted value
      formData.append("clerkUserId", newsData.clerkUserId);

      // Handle tags
      if (newsData.tags) {
        formData.append("tags", newsData.tags);
      }

      // Handle file upload - match backend's expected field name 'profileImage'
      if (newsData.file) {
        formData.append("profileImage", newsData.file);
      }

      // Debug logging
      console.log("Sending data to server:", {
        title: newsData.title,
        description: newsData.description.substring(0, 50) + "...",
        regionId: newsData.regionId,
        regionType: formattedRegionType, // Log the capitalized regionType
        clerkUserId: newsData.clerkUserId,
        tags: newsData.tags,
        hasFile: !!newsData.file
      });

      const response = await contentService.post(
        "/api/v1/content/news/create-news",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            console.log(`Upload Progress: ${percentCompleted}%`);
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Request failed:", {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        error: error.message
      });

      return rejectWithValue(
        error.response?.data?.message || "Failed to create news. Please try again."
      );
    }
  }
);



// Slice for news state management
const newsSlice = createSlice({
  name: "news",
  initialState: {
    news: [], // List of news items
    loading: false, // Loading state for both fetching and creating
    error: null, // Error message
  },
  reducers: {
    // Reducer to clear news state
    clearNews: (state) => {
      state.news = [];
      state.error = null; // Reset error when clearing news
    },
  },
  extraReducers: (builder) => {
    builder
      // Pending state for fetching news
      .addCase(fetchNewsByRegion.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on new fetch
      })
      // Fulfilled state for fetching news
      .addCase(fetchNewsByRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.news = action.payload; // Populate news data
      })
      // Rejected state for fetching news
      .addCase(fetchNewsByRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong"; // Capture error
      })
      // Pending state for creating news
      .addCase(createNews.pending, (state) => {
        state.loading = true;
        state.error = null; // Reset error on news creation
      })
      // Fulfilled state for creating news
      .addCase(createNews.fulfilled, (state, action) => {
        state.loading = false;
        state.news.push(action.payload); // Add new news to the state
      })
      // Rejected state for creating news
      .addCase(createNews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create news"; // Capture error
      });
  },
});

// Export the clearNews action
export const { clearNews } = newsSlice.actions;

// Export the reducer
export default newsSlice.reducer;
