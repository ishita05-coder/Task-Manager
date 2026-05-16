import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  history: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

const API_URL = 'http://localhost:5000/api/history/';

export const getHistory = createAsyncThunk('history/getAll', async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = { headers: { Authorization: `Bearer ${token}` } };
    const response = await axios.get(API_URL, config);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const historySlice = createSlice({
  name: 'history',
  initialState,
  reducers: {
    resetHistoryState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getHistory.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.history = action.payload;
      })
      .addCase(getHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      });
  },
});

export const { resetHistoryState } = historySlice.actions;
export default historySlice.reducer;
