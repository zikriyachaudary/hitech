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
  isRtl: false,
  cartDetail: [],
  adminUsersList: [],
  productCategoryList: [],
  pushObj: null,
  showNoti: false,
  productsList: [],
  notificationsList: [],
  pendingOrders: [],
  dispatchedOrdersList: [],
  ordersList: [],
  addressList: [],
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
    setIsRtl: (state, action) => {
      state.isRtl = action.payload;
    },
    updateCartDetail: (state, action) => {
      state.cartDetail = action.payload;
    },
    setAdminUsersList: (state, action) => {
      state.adminUsersList = action.payload;
    },
    setProductCategoryList: (state, action) => {
      state.productCategoryList = action.payload;
    },
    setPushNotifiObj: (state, action) => {
      state.pushObj = action.payload;
    },
    setIsShowNoti: (state, action) => {
      state.showNoti = action.payload;
    },
    setProductList: (state, action) => {
      state.productsList = action.payload;
    },
    setNotiList: (state, action) => {
      state.notificationsList = action.payload;
    },
    setPendingOrders: (state, action) => {
      const { date, orders } = action.payload;
      const existingIndex = state.pendingOrders.findIndex(
        (item: any) => item.date === date
      );
      if (existingIndex !== -1) {
        state.pendingOrders[existingIndex].orders = orders;
      } else {
        state.pendingOrders.push({ date, orders });
      }
    },

    setDispatchedOrders: (state, action) => {
      state.dispatchedOrdersList = action.payload;
    },
    setAddressList: (state, action) => {
      state.addressList = action.payload;
    },
    setOrdersList: (state, action) => {
      state.ordersList = action.payload;
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
  setIsRtl,
  updateCartDetail,
  setAdminUsersList,
  setProductCategoryList,
  setPushNotifiObj,
  setIsShowNoti,
  setProductList,
  setNotiList,
  setPendingOrders,
  setDispatchedOrders,
  setAddressList,
  setOrdersList,
} = Reducer.actions;

export default Reducer.reducer;
