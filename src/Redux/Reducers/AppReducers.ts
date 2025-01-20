import { createSlice } from "@reduxjs/toolkit";
import { IReduxState } from "../../Utils/AppTypes";

const initialState: IReduxState = {
  currentTab: 0,
  isNetConnected: false,
  isLoaderStart: false,
  isAlertShow: false,
  userData: null,
  updateToken: null,
  showToast: { type: "", message: "" },
  isNotchBar: false,
};

export const Reducer = createSlice({
  name: "Reducer",
  initialState,
  reducers: {
    setTab: (state, action) => {
      state.currentTab = action.payload;
    },
    setNetState: (state, action) => {
      state.isNetConnected = action.payload;
    },
    setIsLoader: (state, action) => {
      state.isLoaderStart = action.payload;
    },

    setIsAlertShow: (state, action) => {
      state.isAlertShow = action.payload;
    },
    setShowToast: (state, action) => {
      state.showToast = action.payload;
    },
    setUserData: (state, action) => {
      state.userData = action.payload;
    },
    setUserToken: (state, action) => {
      state.updateToken = action.payload;
    },
    logOut: (state, action) => {
      state.userData = action.payload;
    },
    setIsNotchBar: (state, action) => {
      state.isNotchBar = action.payload;
    },
  },
});

export const {
  setTab,
  setNetState,
  setIsLoader,
  setIsAlertShow,
  setUserData,
  setUserToken,
  logOut,
  setShowToast,
  setIsNotchBar,
} = Reducer.actions;

export default Reducer.reducer;
