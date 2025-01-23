import {
  FlatList,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useRef } from "react";
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
import { useSelector } from "react-redux";
import ProfilePlaceHolderComp from "../Components/ProfilePlaceHolder";

const NotificationScreen = (props: ScreenProps) => {
  const selector = useSelector((state: any) => state.SliceReducer);

  const flatListRef = useRef<any>(null);

  const notificationList = [
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
    {
      title: "New Order Placed",
      des: "The anonymous person placed the order",
      notificationId: "46Fg67u",
      type: "Order",
      sender: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Zikriya Chaudary",
      },
      reciever: {
        id: "45Uyh8",
        profile:
          "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/1sxbDfF61C4FB7-1D05-4A75-B973-BF2D3FE292A9.jpg?alt=media&token=59f7c57a-076f-4a99-a69c-b801f132c185",
        name: "Haroon Haider",
      },
    },
  ];

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader title={"Notifications"} />
      <FlatList
        data={notificationList}
        style={styles.mainList}
        ref={flatListRef}
        keyExtractor={(index, item) => `${index}`}
        showsVerticalScrollIndicator={false}
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
                    <Text style={styles.message} numberOfLines={2}>
                      {item?.des}
                    </Text>
                  </View>
                </View>
                {item?.createdAt && (
                  <Text style={styles.timeTxt}>
                    {moment(item?.createdAt, "YYYY/MM/DD").format("DD/MM/YYYY")}
                  </Text>
                )}
              </TouchableOpacity>
              <View
                style={{
                  backgroundColor: AppColors.grey.greyLevel3,
                  height: 0.5,
                }}
              />
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
    // maxWidth: 230,
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
    // minWidth: normalized(300),
    marginTop: 3,
  },
  timeTxt: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
    width: 80,
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
