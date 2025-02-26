import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; 
import axios from "axios";
 
export const fetchMentors = createAsyncThunk(
  "mentors/fetchMentors",
  async (_, { getState,rejectWithValue }) => {
    try {
        const token = getState().auth.data?.data?.token;
      const response = await axios.get("https://interngo.onrender.com/api/users/role/fetch", {
        params: { roleName: ["Mentors"] },
        headers: { Authorization: `Bearer ${token}` },
      }); 
      return response.data?.data;  
    } catch (error) { 
      return rejectWithValue(error || "Error fetching mentors");
    }
  }
);

const MentorSlice = createSlice({
  name: "mentors",
  initialState: {
    mentors: [],
    loading: false,
    error: null,
  },
  reducers: {  
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMentors.pending, (state) => { 
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMentors.fulfilled, (state, action) => {         
        state.loading = false;
        state.mentors = action.payload||[];
      })
      .addCase(fetchMentors.rejected, (state, action) => { 
        state.loading = false;
        state.error = action.payload;
      });
  },
});
 
export default MentorSlice.reducer;
