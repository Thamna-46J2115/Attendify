import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch attendance history
export const fetchAttendance = createAsyncThunk(
  "attendance/fetchAttendance",
  async (token, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:3001/student/attendance",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return res.data; // 👈 IMPORTANT
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch attendance"
      );
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    history: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchAttendance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.loading = false;
        state.history = action.payload; // 👈 THIS WAS THE BUG
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default attendanceSlice.reducer;
