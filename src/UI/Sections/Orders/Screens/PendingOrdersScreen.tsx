import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Routes } from "../../../../Utils/Routes";
import {
  AppColors,
  AppFonts,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import OrderItem from "../Components/OrderItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { getPendingOrdersList } from "../../../../Network/Services/GeneralServices";
import { setPendingOrders } from "../../../../Redux/Reducers/AppReducers";
import DatePicker from "react-native-date-picker";

const PendingOrdersScreen = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const navigation: any = useNavigation();
  const isRtl = selector?.isRtl;
  const [pendingOrdersList, setPendingOrdersList] = useState<any>([]);
  const isFocused = useIsFocused();

  const [defautFormat, setDefaultFormat] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(
    moment(Date.now()).format("DD MMM YYYY")
  );
  const maxDate = moment(Date.now()).format("YYYY-MM-DD");
  const [isShowDateModal, setIsShowDateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const orders = selector.pendingOrders.find(
      (item: any) => item.date === selectedDate
    );

    setPendingOrdersList(orders?.orders || []);
    fetchPendingOrders();
  }, [selectedDate, isFocused]);

  const fetchPendingOrders = async () => {
    pendingOrdersList?.length == 0 && setIsLoading(true);
    await getPendingOrdersList(selectedDate, (resp: any) => {
      if (resp.status) {
        setPendingOrdersList(resp.data);
        dispatch(setPendingOrders({ date: selectedDate, orders: resp.data }));
        setIsLoading(false);
      } else {
        setIsLoading(false);
      }
    });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setIsShowDateModal(true);
        }}
        activeOpacity={0.8}
        style={styles.dateCont}
      >
        <Text style={styles.dateTxt}>{selectedDate}</Text>
      </TouchableOpacity>

      {isLoading ? (
        <View style={styles.loaderCont}>
          <ActivityIndicator color={AppColors.themeColor.dark} size={"large"} />
        </View>
      ) : (
        <FlatList
          data={pendingOrdersList}
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
          ListEmptyComponent={() => (
            <View
              style={{
                height: ScreenSize.height / 1.5,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={[
                  styles.dateTxt,
                  {
                    alignSelf: "center",
                  },
                ]}
              >
                {isRtl
                  ? "موجودہ تاریخ میں کوئی آرڈرز نہیں ملے۔"
                  : "No Orders Found in Current Date."}
              </Text>
            </View>
          )}
        />
      )}
      <DatePicker
        modal
        mode="date"
        open={isShowDateModal}
        date={defautFormat}
        maximumDate={new Date(maxDate)}
        onConfirm={(date) => {
          setIsShowDateModal(false);
          setSelectedDate(moment(date).format("DD MMM YYYY"));
          setDefaultFormat(date);
        }}
        onCancel={() => {
          setIsShowDateModal(false);
        }}
      />
    </View>
  );
};

export default PendingOrdersScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loaderCont: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
