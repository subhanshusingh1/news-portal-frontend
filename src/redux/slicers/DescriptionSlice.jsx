import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { regionService } from '../../utils/axiosInstances';

// Combined fetch for both name and description
export const fetchDescription = createAsyncThunk(
  'region/fetchData',
  async ({ id, regionType }) => {
    const response = await regionService.get(
      `/api/v1/region/${regionType}/${id}/description`
    );
    console.log(response.data)
    console.log(`${regionType},${id}`)
    return response.data;
  }
);

const initialState = {
  data: null,
  status: 'idle',
  error: null,
};

const descriptionSlicer = createSlice({
  name: 'description',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDescription.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchDescription.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
        state.error = null;
      })
      .addCase(fetchDescription.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch region data';
      });
  },
});

export default descriptionSlicer.reducer;
