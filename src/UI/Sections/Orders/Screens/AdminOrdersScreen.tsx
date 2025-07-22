import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import OrdersTopTabNav from "./OrdersTopTabNav";
import { useDispatch, useSelector } from "react-redux";
import {
  setDispatchedOrders,
  setIsLoader,
  setPendingOrders,
} from "../../../../Redux/Reducers/AppReducers";
import { getAllOrdersList } from "../../../../Network/Services/GeneralServices";
import { ORDER_STATUS } from "../../../../Utils/AppStrings";

const AdminOrdersScreen = () => {
  const selector = useSelector((state: any) => state.SliceReducer);
  const dispatch = useDispatch();

  const [pendingOrdersList, setPendingOrdersList] = useState(
    selector?.pendingOrdersList
  );
  const [dispatchedOrdersList, setDispatchedOrdersList] = useState(
    selector?.dispatchedOrdersList
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const fetchAllOrders = async () => {
    !selector?.pendingOrdersList[0] && dispatch(setIsLoader(true));
    await getAllOrdersList((resp: any) => {
      if (resp?.status) {
        console.log("length --->>>   ", resp?.data?.length);

        const pendingOrders = resp?.data?.filter(
          (order: any) => order.orderStatus != ORDER_STATUS.Dispatched
        );
        const dispatchedOrders = resp?.data?.filter(
          (order: any) => order.orderStatus == ORDER_STATUS.Dispatched
        );

        setPendingOrdersList(pendingOrders);
        setDispatchedOrdersList(dispatchedOrders);
        // dispatch(setPendingOrders(pendingOrders));
        // dispatch(setDispatchedOrders(dispatchedOrders));
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
      }
    });
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchAllOrders();
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <OrdersTopTabNav
        pendingOrders={pendingOrdersList}
        dispatchOrders={dispatchedOrdersList}
        handleRefresh={() => handleRefresh()}
        refreshing={refreshing}
      />
    </View>
  );
};

export default AdminOrdersScreen;

const styles = StyleSheet.create({});
