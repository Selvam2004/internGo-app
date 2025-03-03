import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
 
export const fetchNotifications = createAsyncThunk(
  "notifications/fetchNotifications",
  async (id, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.data?.data?.token; 
      const response = await axios.get(`https://interngo.onrender.com/api/notifications/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let notifications = response.data.data || [];

      if (notifications.length > 0) {
        notifications = notifications.map((dt) => ({
          id: dt.id,
          message: dt.message,
          type: dt.type?.split("-")[0] +" "+ dt.type?.split("-")[1],
          timestamp: new Date(dt.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }),
          isRead: dt.isRead,
        }));
      }

      return notifications;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Error fetching notifications");
    }
  }
);
 
export const fetchAnnouncements = createAsyncThunk(
  "notifications/fetchAnnouncements",
  async (_, { getState, rejectWithValue }) => {
    try {
      const token = getState().auth.data?.data?.token;   
      const response = await axios.get(`https://interngo.onrender.com/api/notifications/get/announcements`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let announcements = response.data.data || [];

      if (announcements.length > 0) {
        announcements = announcements.map((dt) => dt.message);
      }

      return announcements;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message || "Error fetching announcements");
    }
  }
);

const NotificationSlice = createSlice({
  name: "notifications",
  initialState: {
    notifications: [],
    announcement: [],
    badge:0,
    loading: false,
    error: null,
  },
  reducers: { 
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      state.badge = state.badge + 1;
    },
    removeNotification: (state, action) => { 
      state.notifications = state.notifications.filter((n) => n.id !== Number(action.payload));
    },
    markAsRead: (state) => {
      state.notifications = state.notifications.map((n) => ({ ...n, isRead: true }));
      state.badge = 0;
    },
    clearAllNotifications: (state) => {
      state.notifications = [];
    }, 
    addAnnouncement: (state, action) => {
      state.announcement.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        const count = action.payload.reduce((acc, val) => {
          if (!val.isRead) {
          return acc+1
          }
        }, 0) 
        state.loading = false;
        state.badge = count;
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchAnnouncements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnouncements.fulfilled, (state, action) => {
        state.loading = false;
        state.announcement = action.payload;
      })
      .addCase(fetchAnnouncements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setNotifications,
  addNotification,
  removeNotification,
  markAsRead,
  clearAllNotifications,
  setAnnouncement,
  addAnnouncement,
} = NotificationSlice.actions;

export default NotificationSlice.reducer;
