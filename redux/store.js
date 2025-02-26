import { configureStore } from '@reduxjs/toolkit'; 
import { persistStore, persistReducer } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import authReducer from './reducers/AuthSlice'
import NotificationReducer from './reducers/NotificationSlice'
import MentorReducer from './reducers/MentorSlice';
import FilterReducer from './reducers/FilterSlice'
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
}; 
const persistedReducer = persistReducer(persistConfig, authReducer); 

const store = configureStore({
  reducer: {
      auth:persistedReducer,
      notifications:NotificationReducer,
      mentors:MentorReducer,
      filters:FilterReducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
export default store;
