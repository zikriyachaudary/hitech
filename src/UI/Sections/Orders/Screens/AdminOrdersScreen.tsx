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
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <OrdersTopTabNav />
    </View>
  );
};

export default AdminOrdersScreen;

const styles = StyleSheet.create({});
