import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  hv,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import AppImageViewer from "../../../Components/AppImageView";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import ProfilePlaceHolderComp from "../Components/ProfilePlaceHolder";
import SimpleHeader from "../../../Components/CustomHeader/SimpleHeader";
import { fetchNotificationReq } from "../../../../Network/Services/NotificationServices";
import {
  setIsLoader,
  setNotiList,
} from "../../../../Redux/Reducers/AppReducers";

const NotificationScreen = (props: ScreenProps) => {
  const selector = useSelector((state: any) => state.SliceReducer);
  const dispatch = useDispatch();
  const [notificationList, setNotificationsList] = useState(
    selector?.notificationsList
  );
  const flatListRef = useRef<any>(null);

  useEffect(() => {
    fetchNotificationsList();
  }, []);

  const fetchNotificationsList = async () => {
    notificationList?.length == 0 && dispatch(setIsLoader(true));
    await fetchNotificationReq(selector?.userData?.userId, (resp: any) => {
      if (resp?.status) {
        dispatch(setIsLoader(false));
        setNotificationsList(resp?.data);
        dispatch(setNotiList(resp?.data));
      } else {
        dispatch(setIsLoader(false));
      }
    });
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <SimpleHeader title={"Notifications"} />
      <FlatList
        data={notificationList}
        style={styles.mainList}
        ref={flatListRef}
        keyExtractor={(index, item) => `${index}`}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={() => <View style={{ height: normalized(40) }} />}
        renderItem={({ item, index }: any) => {
          return (
            <>
              <TouchableOpacity
                activeOpacity={1}
                style={styles.singleItem}
                onPress={() => {}}
              >
                <View style={styles.profileCont}>
                  {item?.sender?.profile ? (
                    <AppImageViewer
                      resizeMode={"cover"}
                      source={{ uri: item?.sender?.profile }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <ProfilePlaceHolderComp
                      index={index}
                      name={item?.sender?.name ?? "Test"}
                      mainStyles={styles.profileImage}
                      nameStyles={{
                        fontSize: normalized(16),
                        fontFamily: AppFonts.OpenSansBold,
                      }}
                    />
                  )}
                  <View style={{ marginStart: 10 }}>
                    <Text style={styles.name}>{item?.title}</Text>
                    <Text style={styles.message}>{item?.body}</Text>
                  </View>
                </View>
                {item?.createdAt && (
                  <Text style={styles.timeTxt}>
                    {moment(item?.createdAts).format("DD MMM")}
                  </Text>
                )}
              </TouchableOpacity>
              {notificationList?.length - 1 != index && (
                <View
                  style={{
                    backgroundColor: AppColors.grey.greyLevel3,
                    height: 0.5,
                    marginVertical: normalized(10),
                    marginHorizontal: normalized(50),
                  }}
                />
              )}
            </>
          );
        }}
        // refreshControl={
        //   <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        // }
        ListEmptyComponent={() => {
          return (
            !selector?.isLoaderStart && (
              <View style={styles.emptyListCont}>
                <Text style={styles.emptyList}>{"No Notification Found!"}</Text>
              </View>
            )
          );
        }}
      />
    </View>
  );
};

export default NotificationScreen;

const styles = StyleSheet.create({
  mainList: {
    flex: 1,
    paddingHorizontal: AppHorizontalMargin,
    marginVertical: 10,
  },
  profileImage: {
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    borderRadius: normalized(22),
    width: normalized(42),
    height: normalized(42),
    resizeMode: "contain",
  },
  singleItem: {
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    height: hv(55),
    marginVertical: 5,
  },
  profileCont: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  name: {
    fontSize: normalized(14),
    fontWeight: "600",
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsRegular,
  },
  message: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    marginTop: normalized(3),
    width: "95%",
  },
  timeTxt: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    position: "absolute",
    top: 0,
    right: 0,
  },
  emptyList: {
    fontSize: normalized(15),
    fontWeight: "400",
    color: AppColors.black.black,
    lineHeight: hv(25),
    textAlign: "center",
  },
  emptyListCont: {
    height: ScreenSize.height - 300,
    justifyContent: "center",
    alignItems: "center",
  },
});
