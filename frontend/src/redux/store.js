import { configureStore } from "@reduxjs/toolkit";
import { reducers } from "./reducers";

// Modern Redux setup using Redux Toolkit for better DevTools integration and performance
const store = configureStore({
  reducer: reducers,
  devTools: {
    // Only enable in development
    enabled: process.env.NODE_ENV !== "production",
    // Trace Redux actions for debugging
    trace: true,
    traceLimit: 25,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore token in localStorage for serialization checks
        ignoredActionPaths: ["payload"],
        ignoredPaths: ["userToken"],
      },
    }),
});

export default store;
