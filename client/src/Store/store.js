import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "../Features/UserSlice";
import postsReducer from "../Features/PostSlice";
import teacherReducer from '../Features/teacherSlice';  
import attendanceReducer from '../Features/attendanceSlice';
import adminReducer from '../Features/adminSlice';
export const store = configureStore({
  reducer: {
    users: usersReducer,
    posts: postsReducer,
    teacher: teacherReducer,
    attendance: attendanceReducer,
    admin: adminReducer,
  },
});
