import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AgentFeaturesState {
  pageNavigation: string;
  showSidebar: boolean;
  isAuthenticated: boolean;
  sidebarNavigation: string;
  filter: {
    plateform: string;
    destination: string;
    startDate: string;
    endDate: string;
  };
  isChatOpen:boolean,
  keyForMessage:boolean
}

const initialState: AgentFeaturesState = {
  pageNavigation: "",
  showSidebar: true,
  isAuthenticated: false,
  sidebarNavigation: "",
  filter: {
    plateform: "",
    destination: "",
    startDate: "",
    endDate: "",
  },
  isChatOpen:false,
  keyForMessage:false
};

export const agentFeaturesSlice = createSlice({
  name: "agentFeatures",
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
    setChatOpen(state, action: PayloadAction<boolean>) {
      state.isChatOpen = action.payload;
    },
    setKeForMessage(state, action: PayloadAction<boolean>) {
      state.keyForMessage = action.payload;
    },
    updateSidebar: (state, action: PayloadAction<boolean>) => {
      state.showSidebar = action.payload;
    },
    updateSidebarNavigation: (state, action: PayloadAction<string>) => {
      state.sidebarNavigation = action.payload;
    },
    updateFilterProduct: (
      state,
      action: PayloadAction<{
        plateform: string;
        destination: string;
        startDate: string;
        endDate: string;
      }>
    ) => {
      state.filter = action.payload;
    },
  },
});

export const {
  updatePageNavigation,
  updateSidebar,
  setChatOpen,
  setKeForMessage,
  login,
  logout,
  updateSidebarNavigation,
  updateFilterProduct
} = agentFeaturesSlice.actions;
export const agentFeaturesReducer = agentFeaturesSlice.reducer;
