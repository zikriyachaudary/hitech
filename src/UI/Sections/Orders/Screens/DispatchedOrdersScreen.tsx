import React, { useEffect, useState } from "react";
import {
  SectionList,
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import moment from "moment";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import { AppColors, normalized } from "../../../../Utils/AppConstants";
import OrderItem from "../Components/OrderItem";
import { Routes } from "../../../../Utils/Routes";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { groupOrdersByDate } from "../../../../Utils/Helper";
import { getDispatchedOrdersList } from "../../../../Network/Services/GeneralServices";
import { setDispatchedOrders } from "../../../../Redux/Reducers/AppReducers";

const DispatchedOrdersScreen = (props: any) => {
  const [sections, setSections] = useState<any>([]);
  const navigation: any = useNavigation();
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const isRtl = selector?.isRtl;
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const [lastDispatchedDoc, setLastDispatchedDoc] = useState<any>(null);
  const [dispatchedOrdersList, setDispatchedOrdersList] = useState<any>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const reduxList = selector?.dispatchedOrdersList || [];

    setDispatchedOrdersList(reduxList);
    setSections(groupOrdersByDate(reduxList, isRtl));

    // Always fetch fresh in background
    fetchDispatchedOrders(true);
  }, [isFocused, isRtl]);

  const fetchDispatchedOrders = async (isInitial = false) => {
    if (loadingMore || isEndReached) return;

    if (isInitial) {
      setIsEndReached(false);
      setLastDispatchedDoc(null);
    }

    setLoadingMore(true);

    await getDispatchedOrdersList(
      (resp: any) => {
        setLoadingMore(false);

        if (resp.status) {
          const newOrders = resp.data || [];

          const mergedList = isInitial
            ? newOrders
            : [
                ...dispatchedOrdersList,
                ...newOrders.filter(
                  (o: any) =>
                    !dispatchedOrdersList.find((d: any) => d.id === o.id)
                ),
              ];

          setDispatchedOrdersList(mergedList);
          setSections(groupOrdersByDate(mergedList, isRtl));
          setLastDispatchedDoc(resp.lastDoc || null);
          dispatch(setDispatchedOrders(mergedList));

          if (resp.isEnd || newOrders.length === 0) {
            setIsEndReached(true);
          }
        }
      },
      isInitial ? null : lastDispatchedDoc,
      12
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item?.id}_${index}`}
        onEndReached={() => fetchDispatchedOrders(false)}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          loadingMore ? (
            <ActivityIndicator
              color={AppColors.themeColor.dark}
              size={"small"}
              style={{ marginVertical: normalized(15), alignSelf: "center" }}
            />
          ) : null
        }
        renderItem={({ item }) => (
          <OrderItem
            item={item}
            onPress={() =>
              navigation.navigate(Routes.Home.OrderDetailScreen, { item })
            }
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.rowCont}>
            <View style={styles.horiDivider} />
            <Text style={styles.sectionTitle}>{title}</Text>
            <View style={styles.horiDivider} />
          </View>
        )}
        contentContainerStyle={{
          paddingBottom: normalized(50),
          gap: normalized(10),
        }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

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
});

export default DispatchedOrdersScreen;
