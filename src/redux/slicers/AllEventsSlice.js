import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

// Async Thunk to fetch events by region
export const fetchEventsByRegion = createAsyncThunk(
  'events/fetchByRegion', // Action type
  async (regionId) => {
    const response = await fetch(`http://localhost:8000/api/v1/content/events/region/${regionId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json(); // Assuming the response contains event data
  }
);

const AllEventsSlice = createSlice({
  name: 'AllEvents',
  initialState: {
    events: [],        // Holds the list of events
    loading: false,    // Tracks loading state
    error: null,       // Tracks any error
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // When the fetch request starts
      .addCase(fetchEventsByRegion.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // When the fetch request is successful
      .addCase(fetchEventsByRegion.fulfilled, (state, action) => {
        state.loading = false;
        state.events = action.payload; // Store the fetched events
      })
      // When the fetch request fails
      .addCase(fetchEventsByRegion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message; // Store the error message
      });
  },
});

export default AllEventsSlice.reducer;
