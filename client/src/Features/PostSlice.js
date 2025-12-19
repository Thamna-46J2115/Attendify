import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
const initialState = {
  posts: [],
  status: null,
  error: null,
};
// SAVE POST
export const savePost = createAsyncThunk(
  "posts/savePost",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:3001/api/savePost", data);
      return res.data.post;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);
// GET POSTS
export const getPosts = createAsyncThunk("posts/getPosts", async () => {
  const res = await axios.get("http://localhost:3001/api/getPosts");
  return res.data.posts;
});
// LIKE POST
export const likePost = createAsyncThunk(
  "posts/likePost",
  async (data, thunkAPI) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/likePost/${data.postId}`,
        { userId: data.userId }
      );
      return res.data.post;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);
// DISLIKE POST
export const dislikePost = createAsyncThunk(
  "posts/dislikePost",
  async (data, thunkAPI) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/api/dislikePost/${data.postId}`,
        { userId: data.userId }
      );
      return res.data.post;
    } catch (e) {
      return thunkAPI.rejectWithValue(e.response.data);
    }
  }
);

const postSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // SAVE POST
      .addCase(savePost.fulfilled, (state, action) => {
        state.posts.unshift(action.payload);
      })
      // GET POSTS
      .addCase(getPosts.fulfilled, (state, action) => {
        state.posts = action.payload;
      })
      // LIKE POST
      .addCase(likePost.fulfilled, (state, action) => {
        const i = state.posts.findIndex((p) => p._id === action.payload._id);
        if (i !== -1) state.posts[i] = action.payload;
      })
      // DISLIKE POST
      .addCase(dislikePost.fulfilled, (state, action) => {
        const i = state.posts.findIndex((p) => p._id === action.payload._id);
        if (i !== -1) state.posts[i] = action.payload;
      });
  },
});

export default postSlice.reducer;
