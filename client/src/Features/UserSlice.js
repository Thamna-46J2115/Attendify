import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

//  نقرأ المستخدم من localStorage بشكل آمن
let savedUser = null;
try {
  savedUser = JSON.parse(localStorage.getItem("user"));
} catch (e) {
  savedUser = null;
}

const initialState = {
  user: savedUser,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: "",
};

//  REGISTER
export const registerUser = createAsyncThunk(
  "users/registerUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:3001/registerUser", data);
      return res.data.newUser;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);

// LOGIN — نحفظ المستخدم كامل

export const loginUser = createAsyncThunk(
  "users/loginUser",
  async (data, thunkAPI) => {
    try {
      const res = await axios.post("http://localhost:3001/login", data);

      const userData = {
        ...res.data.user,
        token: res.data.token,
      };

      localStorage.setItem("user", JSON.stringify(userData));
      return userData;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Invalid credentials"
      );
    }
  }
);

// LOGOUT
export const logoutUser = createAsyncThunk("users/logoutUser", async () => {
  localStorage.removeItem("user");
  return null;
});

//  UPDATE PROFILE
export const updateUserProfile = createAsyncThunk(
  "users/updateUserProfile",
  async (data, thunkAPI) => {
    try {
      const res = await axios.put(
        `http://localhost:3001/user/update-profile/${data._id}`,
        data.formData,
        {
          headers: {
            Authorization: data.token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // ندمج التوكن القديم مع البيانات الجديدة
      const saved = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...saved,
        ...res.data.user,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (e) {
      return thunkAPI.rejectWithValue("Update failed");
    }
  }
);

// SLICE
const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    resetState: (state) => {
      state.isLoading = false;
      state.isError = false;
      state.isSuccess = false;
      state.message = "";
    },
  },

  extraReducers: (builder) => {
    builder

      //  REGISTER
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //  LOGIN
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })

      //  LOGOUT
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isSuccess = false;
        state.isLoading = false;
      })

      //  UPDATE PROFILE
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
        state.isSuccess = true;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetState } = userSlice.actions;
export default userSlice.reducer;
