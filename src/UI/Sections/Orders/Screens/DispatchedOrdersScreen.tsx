import React, { useEffect, useState } from "react";
import {
  SectionList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  FlatList,
} from "react-native";
import moment from "moment";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import {
  AppColors,
  AppFonts,
  normalized,
} from "../../../../Utils/AppConstants";
import OrderItem from "../Components/OrderItem";
import { Routes } from "../../../../Utils/Routes";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { groupOrdersByDate } from "../../../../Utils/Helper";
import { getDispatchedOrdersList } from "../../../../Network/Services/GeneralServices";
import { setDispatchedOrders } from "../../../../Redux/Reducers/AppReducers";
import DatePicker from "react-native-date-picker";

const DispatchOrdersScreen = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const isRtl = selector?.isRtl;
  const isFocused = useIsFocused();

  const [dispatchedOrdersList, setDispatchedOrdersList] = useState<any>([]);
  const [selectedDate, setSelectedDate] = useState(
    moment(Date.now()).format("DD MMM YYYY")
  );
  const maxDate = moment(Date.now()).format("YYYY-MM-DD");
  const [isShowDateModal, setIsShowDateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchDispatchedOrders();
  }, [selectedDate, isFocused]);

  const fetchDispatchedOrders = async () => {
    setIsLoading(true);
    await getDispatchedOrdersList(selectedDate, (resp: any) => {
      if (resp.status) {
        setDispatchedOrdersList(resp.data);
        dispatch(setDispatchedOrders(resp.data));
      }
      setIsLoading(false);
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setIsShowDateModal(true)}
        activeOpacity={0.8}
        style={styles.dateCont}
      >
        <Text style={styles.dateTxt}>{selectedDate}</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loaderCont}>
          <ActivityIndicator color={AppColors.themeColor.dark} size="large" />
        </View>
      ) : (
        <FlatList
          data={dispatchedOrdersList}
          keyExtractor={(item, index) => `${item?.id}_${index}`}
          contentContainerStyle={{
            paddingBottom: normalized(50),
            gap: normalized(10),
          }}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <OrderItem
              item={item}
              onPress={() =>
                navigation.navigate(Routes.Home.OrderDetailScreen, { item })
              }
            />
          )}
        />
      )}

      <DatePicker
        modal
        mode="date"
        open={isShowDateModal}
        date={new Date()}
        maximumDate={new Date(maxDate)}
        onConfirm={(date) => {
          setIsShowDateModal(false);
          setSelectedDate(moment(date).format("DD MMM YYYY"));
        }}
        onCancel={() => {
          setIsShowDateModal(false);
        }}
      />
    </View>
  );
};

export default DispatchOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  sectionTitle: {
    fontSize: normalized(16),
    fontWeight: "bold",
    paddingVertical: normalized(12),
    marginHorizontal: normalized(10),
    backgroundColor: AppColors.white.white,
    alignSelf: "center",
  },
  horiDivider: {
    flex: 1,
    height: normalized(1),
    backgroundColor: AppColors.grey.greyLevel2,
    marginHorizontal: normalized(10),
    alignSelf: "center",
  },
  rowCont: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    gap: normalized(10),
    flex: 1,
    width: "100%",
    paddingHorizontal: normalized(30),
    backgroundColor: AppColors.white.white,
  },
  loaderCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  dateCont: {
    alignSelf: "flex-end",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: AppColors.white.white,
    borderWidth: 1,
    borderRadius: normalized(5),
    borderColor: AppColors.grey.greyLevel2,
    paddingHorizontal: normalized(12),
    paddingVertical: normalized(4),
    margin: normalized(15),
  },
  dateTxt: {
    fontSize: normalized(12),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
  },
});
