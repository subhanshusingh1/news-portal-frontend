import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { authService } from "../../utils/axiosInstances";

// Thunk to check subscription status (with dynamic regionId and regionType)
export const checkSubscriptionStatus = createAsyncThunk(
  "subscription/checkStatus",
  async ({ clerkUserId, regionId, regionType }, { rejectWithValue }) => {
    try {
      // Capitalize the first letter of regionType
      const formattedRegionType =
        regionType.charAt(0).toUpperCase() + regionType.slice(1);

      const response = await authService.get(
        `/api/v1/users/${clerkUserId}/subscription-status`,
        {
          params: {
            regionId, // Send regionId as a query parameter
            regionType: formattedRegionType, // Send regionType as a query parameter
          },
        }
      );

      console.log(response)

      // Return the complete subscription status object
      return {
        subscribed: response.data.subscribed,
        message: response.data.message,
        regionId: response.data.regionId,
        regionType: response.data.regionType
      };
    } catch (error) {
      // Use rejectWithValue to properly handle the error
      return rejectWithValue(error.response?.data?.message || "Error checking subscription status");
    }
  }
);

// Thunk to fetch all subscribed regions for the dropdown
export const fetchSubscribedRegions = createAsyncThunk(
  "subscription/fetchSubscribedRegions",
  async (userId) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/v1/user/${userId}/subscriptions`
      );
      return response.data; // Expecting an array of { regionId, regionType, subscribedAt }
    } catch (error) {
      throw new Error("Error fetching subscribed regions");
    }
  }
);

// Thunk to subscribe to a region
export const subscribeToRegion = createAsyncThunk(
  "subscription/subscribe",
  async ({ clerkUserId, regionId, regionType }, { rejectWithValue }) => {
    // Capitalize the first letter of regionType
    const formattedRegionType =
      regionType.charAt(0).toUpperCase() + regionType.slice(1);

    try {
      const response = await axios.post(
        "http://localhost:5001/api/v1/users/subscribe",
        {
          clerkUserId,
          regionId,
          regionType: formattedRegionType,
        }
      );

      return response.data; // Handle success response from the backend
    } catch (error) {
      return rejectWithValue(error.response?.data || "Subscription failed");
    }
  }
);

// Thunk to unsubscribe from a region
export const unsubscribeFromRegion = createAsyncThunk(
  "subscription/unsubscribe",
  async ({ clerkUserId, regionId, regionType }, { rejectWithValue }) => {
    // Capitalize the first letter of regionType
    const formattedRegionType =
      regionType.charAt(0).toUpperCase() + regionType.slice(1);

    try {
      const response = await axios.patch(
        `http://localhost:5001/api/v1/users/${clerkUserId}/unsubscribe`,
        {
          regionId,
          regionType: formattedRegionType,
        }
      );

      return response.data; // Handle success response from the backend
    } catch (error) {
      return rejectWithValue(error.response?.data || "Unsubscription failed");
    }
  }
);

// Create the slice
const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscribed: false,
    message: "",
    regionId: null, // To store the dynamic regionId
    regionType: null, // To store the dynamic regionType
    regions: [], // List of subscribed regions for dropdown
    status: "idle", // 'loading', 'succeeded', 'failed' for subscription status
    regionsStatus: "idle", // 'loading', 'succeeded', 'failed' for fetching regions
    subscribeStatus: "idle", // 'loading', 'succeeded', 'failed' for subscribing to a region
    unsubscribeStatus: "idle", // 'loading', 'succeeded', 'failed' for unsubscribing from a region
    error: null,
  },
  reducers: {
    // Add a reducer to handle region selection for the dropdown
    setSelectedRegion: (state, action) => {
      state.regionId = action.payload.regionId;
      state.regionType = action.payload.regionType;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle subscription status check
      .addCase(checkSubscriptionStatus.pending, (state) => {
        state.subscribeStatus = 'loading';
        state.error = null;
      })
      .addCase(checkSubscriptionStatus.fulfilled, (state, action) => {
        state.subscribeStatus = 'idle';
        state.subscribed = action.payload.subscribed;
        state.message = action.payload.message;
        state.regionId = action.payload.regionId;
        state.regionType = action.payload.regionType;
        state.error = null;
      })
      .addCase(checkSubscriptionStatus.rejected, (state, action) => {
        state.subscribeStatus = 'failed';
        state.error = action.payload;
      })

      // Handle fetching subscribed regions
      .addCase(fetchSubscribedRegions.pending, (state) => {
        state.regionsStatus = "loading";
      })
      .addCase(fetchSubscribedRegions.fulfilled, (state, action) => {
        state.regionsStatus = "succeeded";
        state.regions = action.payload; // Store the array of subscribed regions
      })
      .addCase(fetchSubscribedRegions.rejected, (state, action) => {
        state.regionsStatus = "failed";
        state.error = action.error.message;
      })
      // Handle subscribing to a region
      .addCase(subscribeToRegion.pending, (state) => {
        state.subscribeStatus = "loading";
      })
      .addCase(subscribeToRegion.fulfilled, (state, action) => {
        state.subscribeStatus = "succeeded";
        state.regions = action.payload; // Update the regions list with the new subscription
        state.subscribed = true; // The user is now subscribed to a region
      })
      .addCase(subscribeToRegion.rejected, (state, action) => {
        state.subscribeStatus = "failed";
        state.error = action.error.message;
      })
      // Handle unsubscribing from a region
      .addCase(unsubscribeFromRegion.pending, (state) => {
        state.unsubscribeStatus = "loading";
      })
      .addCase(unsubscribeFromRegion.fulfilled, (state, action) => {
        state.unsubscribeStatus = "succeeded";
        state.regions = action.payload.subscriptions; // Update the regions list after unsubscribing
        state.subscribed = false; // The user is no longer subscribed to the region
      })
      .addCase(unsubscribeFromRegion.rejected, (state, action) => {
        state.unsubscribeStatus = "failed";
        state.error = action.error.message;
      });
  },
});

// Export the reducer and actions
export const { setSelectedRegion } = subscriptionSlice.actions;
export default subscriptionSlice.reducer;
