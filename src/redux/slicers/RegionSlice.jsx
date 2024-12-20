import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { regionService } from "../../utils/axiosInstances";

// Fetch root regions (no ID needed for the first fetch)
export const fetchRootRegions = createAsyncThunk(
  "region/fetchRootRegions",
  async ({ regionType }, { rejectWithValue }) => {
    try {
      const response = await regionService.get(`/api/v1/region/root/${regionType}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch root regions");
    }
  }
);

// Fetch region by ID (district, city, locality levels need regionId)
export const fetchRegionById = createAsyncThunk(
  "region/fetchRegionById",
  async ({ id, regionType }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`http://localhost:5003/api/v1/region/${regionType}/${id}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch the region");
    }
  }
);

const regionSlice = createSlice({
  name: "region",
  initialState: {
    rootRegions: [],
    childRegions: {},
    selectedRegions: [],
    status: "idle",
    error: null,
  },
  reducers: {
    resetRegions: (state) => {
      state.selectedRegions = [];
      state.childRegions = {};
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRootRegions.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRootRegions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.rootRegions = action.payload.data;
      })
      .addCase(fetchRootRegions.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchRegionById.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchRegionById.fulfilled, (state, action) => {
        state.status = "succeeded";
        const { id, regionType } = action.meta.arg;
        if (!state.childRegions[regionType]) {
          state.childRegions[regionType] = {};
        }
        state.childRegions[regionType][id] = action.payload.data;
      })
      .addCase(fetchRegionById.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      });
  },
});

export const { resetRegions } = regionSlice.actions;

export default regionSlice.reducer;
