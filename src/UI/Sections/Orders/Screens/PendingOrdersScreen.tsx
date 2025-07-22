import {
  ActivityIndicator,
  FlatList,
  SectionList,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { Routes } from "../../../../Utils/Routes";
import { AppColors, normalized } from "../../../../Utils/AppConstants";
import OrderItem from "../Components/OrderItem";
import { useIsFocused, useNavigation } from "@react-navigation/native";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { groupOrdersByDate } from "../../../../Utils/Helper";
import { getPendingOrdersList } from "../../../../Network/Services/GeneralServices";
import { setPendingOrders } from "../../../../Redux/Reducers/AppReducers";

const PendingOrdersScreen = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const [sections, setSections] = useState<any>([]);
  const navigation: any = useNavigation();
  const isRtl = selector?.isRtl;
  const [loadingMore, setLoadingMore] = useState(false);
  const [isEndReached, setIsEndReached] = useState(false);
  const [lastPendingDoc, setLastPendingDoc] = useState<any>(null);
  const [pendingOrdersList, setPendingOrdersList] = useState<any>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    const reduxList = selector?.pendingOrdersList || [];

    setPendingOrdersList(reduxList);
    setSections(groupOrdersByDate(reduxList, isRtl));

    // Always fetch fresh in background
    fetchPendingOrders(true);
  }, [isFocused, isRtl]);

  const fetchPendingOrders = async (isInitial = false) => {
    if (loadingMore || isEndReached) return;

    if (isInitial) {
      setIsEndReached(false);
      setLastPendingDoc(null);
    }

    setLoadingMore(true);

    await getPendingOrdersList(
      (resp: any) => {
        setLoadingMore(false);

        if (resp.status) {
          const newOrders = resp.data || [];

          const mergedList = isInitial
            ? newOrders
            : [
                ...pendingOrdersList,
                ...newOrders.filter(
                  (o: any) => !pendingOrdersList.find((d: any) => d.id === o.id)
                ),
              ];

          setPendingOrdersList(mergedList);
          setSections(groupOrdersByDate(mergedList, isRtl));
          setLastPendingDoc(resp.lastDoc || null);
          dispatch(setPendingOrders(mergedList));

          if (resp.isEnd || newOrders.length === 0) {
            setIsEndReached(true);
          }
        }
      },
      isInitial ? null : lastPendingDoc,
      12
    );
  };

  return (
    <View style={styles.container}>
      <SectionList
        sections={sections}
        keyExtractor={(item, index) => `${item?.id}_${index}`}
        onEndReached={() => fetchPendingOrders(false)}
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

export default PendingOrdersScreen;

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
