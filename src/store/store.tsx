import { featuresReducer } from "@/features/features";
import {agentFeaturesReducer} from "@/features/agentFeatures";
import { configureStore } from "@reduxjs/toolkit";

export const store = configureStore({
  reducer: {
    features: featuresReducer,
    agentFeatures: agentFeaturesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
