import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
  tasks: [],
  task: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
  page: 1,
  pages: 1,
  total: 0,
};

const API_URL = import.meta.env.PROD 
  ? 'https://task-manager-backend-61um.onrender.com/api/tasks/' 
  : 'http://localhost:5000/api/tasks/';

export const getTasks = createAsyncThunk('tasks/getAll', async (queryStr = '', thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.get(API_URL + queryStr, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const createTask = createAsyncThunk('tasks/create', async (taskData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.post(API_URL, taskData, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const updateTask = createAsyncThunk('tasks/update', async (taskData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await axios.put(API_URL + taskData._id, taskData, config);
    return response.data;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const deleteTask = createAsyncThunk('tasks/delete', async (id, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user.token;
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    await axios.delete(API_URL + id, config);
    return id;
  } catch (error) {
    const message = (error.response && error.response.data && error.response.data.message) || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const taskSlice = createSlice({
  name: 'task',
  initialState,
  reducers: {
    resetTaskState: (state) => {
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
    taskAdded: (state, action) => {
        state.tasks.unshift(action.payload);
        state.total += 1;
    },
    taskUpdated: (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if(index !== -1) {
            state.tasks[index] = action.payload;
        }
    },
    taskDeleted: (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload);
        if (index !== -1) {
            state.tasks.splice(index, 1);
            state.total -= 1;
        }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks = action.payload.tasks;
        state.page = action.payload.page;
        state.pages = action.payload.pages;
        state.total = action.payload.total;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(createTask.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.tasks.unshift(action.payload);
        state.total += 1;
      })
      .addCase(createTask.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload._id);
        if(index !== -1) {
            state.tasks[index] = action.payload;
        }
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const index = state.tasks.findIndex(t => t._id === action.payload);
        if (index !== -1) {
            state.tasks.splice(index, 1);
            state.total -= 1;
        }
      });
  },
});

export const { resetTaskState, taskAdded, taskUpdated, taskDeleted } = taskSlice.actions;
export default taskSlice.reducer;
