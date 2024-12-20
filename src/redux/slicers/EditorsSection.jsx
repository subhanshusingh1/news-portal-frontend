// src/features/products/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Dummy data for fallback
const dummyData = [
  {
    id: 1,
    name: 'Earthen Bottle',
    href: '/news/1',
    price: '$48',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-01.jpg',
    imageAlt: 'Tall slender porcelain bottle with natural clay textured body and cork stopper.',
  },
  {
    id: 2,
    name: 'Nomad Tumbler',
    href: '/news/2',
    price: '$35',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-02.jpg',
    imageAlt: 'Olive drab green insulated bottle with flared screw lid and flat top.',
  },
  {
    id: 3,
    name: 'Focus Paper Refill',
    href: '/news/3',
    price: '$89',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-03.jpg',
    imageAlt: 'Person using a pen to cross a task off a productivity paper card.',
  },
  {
    id: 4,
    name: 'Machined Mechanical Pencil',
    href: '/news/4',
    price: '$35',
    imageSrc: 'https://tailwindui.com/plus/img/ecommerce-images/category-page-04-image-card-04.jpg',
    imageAlt: 'Hand holding black machined steel mechanical pencil with brass tip and top.',
  },
];

// Async thunk to fetch the editor picks data from an API
export const fetchEditorPicks = createAsyncThunk('products/fetchEditorPicks', async () => {
  try {
    const response = await axios.get('/api/products'); // Update with your actual API endpoint
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return dummyData;  // Return dummy data if API fails
  }
});

const EditorsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    status: 'idle', // 'idle', 'loading', 'succeeded', 'failed'
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchEditorPicks.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEditorPicks.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
      })
      .addCase(fetchEditorPicks.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default EditorsSlice.reducer;
