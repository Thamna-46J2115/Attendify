import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  sessions: [],
  isLoading: false,
  isError: false,
  isSuccess: false,
  message: "",
};

export const fetchSessions = createAsyncThunk(
  "teacher/fetchSessions",
  async (token, thunkAPI) => {
    try {
      const res = await axios.get("http://localhost:3001/teacher/sessions", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return Array.isArray(res.data) ? res.data : [];
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch sessions"
      );
    }
  }
);

export const createSession = createAsyncThunk(
  "teacher/createSession",
  async ({ token, sessionData }, thunkAPI) => {
    try {
      const res = await axios.post(
        "http://localhost:3001/teacher/create-session",
        sessionData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create session"
      );
    }
  }
);

export const deleteSession = createAsyncThunk(
  "teacher/deleteSession",
  async ({ token, id }, thunkAPI) => {
    try {
      await axios.delete(`http://localhost:3001/sessions/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete session"
      );
    }
  }
);

export const updateSession = createAsyncThunk(
  "teacher/updateSession",
  async ({ token, id, updatedData }, thunkAPI) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/sessions/${id}`,
        updatedData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      return res.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update session"
      );
    }
  }
);

const teacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSessions.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchSessions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.sessions = action.payload;
      })
      .addCase(fetchSessions.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.sessions = [];
      })
      .addCase(createSession.fulfilled, (state, action) => {
        state.sessions.push(action.payload);
      })
      .addCase(deleteSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.filter(
          (s) => s._id !== action.payload
        );
      })
      .addCase(updateSession.fulfilled, (state, action) => {
        state.sessions = state.sessions.map((s) =>
          s._id === action.payload._id ? action.payload : s
        );
      });
  },
});

export default teacherSlice.reducer;
