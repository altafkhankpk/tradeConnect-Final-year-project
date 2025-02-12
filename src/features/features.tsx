import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface FeaturesState {
  pageNavigation: string;
  showSidebar: boolean;
  isAuthenticated: boolean;
  role: string;
  sidebarNavigation: string;
}

const initialState: FeaturesState = {
  pageNavigation: "",
  showSidebar: true,
  isAuthenticated: false,
  role: "",
  sidebarNavigation: ""
};

export const featuresSlice = createSlice({
  name: "features",
  initialState,
  reducers: {
    login: (state) => {
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.isAuthenticated = false;
    },
    updatePageNavigation: (state, action: PayloadAction<string>) => {
      state.pageNavigation = action.payload;
    },
    updateSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
    updateRole: (state, action: PayloadAction<string>) => {
      state.role = action.payload;
    },
    updateSidebarNavigation: (state, action: PayloadAction<string>) => {
      state.sidebarNavigation = action.payload;
    }
  },
});

export const {
  updatePageNavigation,
  updateSidebar,
  login,
  logout,
  updateRole,
  updateSidebarNavigation
} = featuresSlice.actions;
export const featuresReducer = featuresSlice.reducer;
