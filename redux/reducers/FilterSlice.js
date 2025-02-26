import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchFilters = createAsyncThunk(
  "filters/fetchFilters",
  async (_, { getState,rejectWithValue }) => {
    try {
      const token = getState().auth.data?.data?.token;
      const response = await axios.get("https://interngo.onrender.com/api/users/distinct/filters",{ 
        headers: { Authorization: `Bearer ${token}` },
      }); 
      return response.data?.data||[];
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Error fetching filters");
    }
  }
);

const FilterSlice = createSlice({
  name: "filters",
  initialState: {
    filters: {},
    loading: false,
    error: null,
  },
  reducers: { 
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFilters.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilters.fulfilled, (state, action) => { 
        state.loading = false;
        state.filters = action.payload || {};
      })
      .addCase(fetchFilters.rejected, (state, action) => { 
        state.loading = false; 
        state.error = action.payload;
      });
  },
});
 
export default FilterSlice.reducer;
