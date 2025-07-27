import { Alert, Platform, SafeAreaView, StyleSheet, View } from "react-native";
import React, { useEffect } from "react";
import AuthStack from "./Navigation/AuthStack";
import { AppStyles } from "./Utils/AppStyles";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "./Redux/store/AppStore";
import MainNavigation from "./Navigation/MainNavigation";
import AppLoader from "./UI/Components/AppLoader";
import ToastComp from "./UI/Components/ToastComp";
import {
  setIsAlertShow,
  setIsShowNoti,
  setProductCategoryList,
  setPushNotifiObj,
} from "./Redux/Reducers/AppReducers";
import AlertModal from "./UI/Components/CustomModal/AlertModal";
import { fetchCatListReq } from "./Network/Services/GeneralServices";
import {
  checkNotifications,
  requestNotifications,
} from "react-native-permissions";
// import { notifications } from "react-native-firebase-push-notifications";
import LocalNotification from "./UI/Components/LocalNotification";
import { updateFCMTokenReq } from "./Network/Services/AuthServices";
import notifee, { AndroidImportance, EventType } from "@notifee/react-native";
// import messaging from "@react-native-firebase/messaging";

const AppContainer = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();

  useEffect(() => {
    getCategoryList();
    // createNotificationChannel();
    // showNotification();
  }, []);

  const getCategoryList = async () => {
    await fetchCatListReq((resp: any) => {
      if (resp?.status) {
        dispatch(setProductCategoryList(resp?.data));
      }
    });
  };

  useEffect(() => {
    if (selector?.userData) {
      // registerDevice();
    }
  }, [selector?.userData]);

  ////////  Notiffee -------------->

  async function createNotificationChannel() {
    await notifee.createChannel({
      id: "default",
      name: "Default Channel",
      importance: AndroidImportance.HIGH,
    });
  }

  // Show Notification simple

  const showNotification = async () => {
    await notifee.displayNotification({
      title: "Hello",
      body: "This is not a test notification",
      android: {
        channelId: "default",
      },
      ios: {
        sound: "default",
      },
    });

    notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log("Notification pressed", detail.notification);
      }
    });

    // messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    //   await notifee.displayNotification({
    //     title: remoteMessage.notification?.title,
    //     body: remoteMessage.notification?.body,
    //     android: {
    //       channelId: "default",
    //     },
    //   });
    // });
  };

  ////////Push notification-------->

  // const registerDevice = async () => {
  //   if (Platform.OS == "ios") {
  //     await getPermissionsForNotification();
  //   } else {
  //     requestNotificationPermission();
  //   }
  // };

  // const requestNotificationPermission = async () => {
  //   if (Platform.OS === "android" && Platform.Version >= 33) {
  //     const { status } = await checkNotifications();
  //     if (status !== "granted") {
  //       const { status: newStatus } = await requestNotifications([
  //         "alert",
  //         "sound",
  //       ]);
  //       if (newStatus === "granted") {
  //         getToken();
  //       } else {
  //         Alert.alert(
  //           "Notification Permission",
  //           "Notification permissions are required to receive notifications. Please enable them in settings."
  //         );
  //       }
  //     } else {
  //       getToken();
  //     }
  //   } else {
  //     getToken();
  //   }
  // };

  // const getToken = async () => {
  //   const token = await notifications.getToken();
  //   if (token && selector?.userData?.userId) {
  //     await updateFCMTokenReq(selector?.userData?.userId, token);
  //     onNotificationListener();
  //     onNotificationOpenedListener();
  //     getInitialNotification();
  //   }
  // };

  // const getPermissionsForNotification = async () => {
  //   const isPermission = await hasPermission();
  //   if (isPermission == false) {
  //     await requestPermission();
  //   }
  //   getToken();
  // };

  // const requestPermission = async () => {
  //   try {
  //     const permission = await notifications.requestPermission();
  //     return permission;
  //   } catch (error) {
  //     console.error("Error requesting permission:", error);
  //     return false; // or handle the error appropriately
  //   }
  // };

  // const hasPermission = async () => {
  //   return await notifications.hasPermission();
  // };

  // const setBadge = async (number: any) => {
  //   return await notifications.setBadge(number);
  // };

  // const getInitialNotification = async () => {
  //   const notification = await notifications
  //     .getInitialNotification()
  //     .then(async (remoteMessage: any) => {
  //       if (remoteMessage) {
  //         dispatch(setPushNotifiObj(remoteMessage.notification));
  //         setTimeout(() => {
  //           openDetail(remoteMessage.notification);
  //         }, 2000);
  //       }
  //     });
  //   return notification;
  // };

  // const onNotificationOpenedListener = (isAppOpen = false) => {
  //   notifications.onNotificationOpened((notification: any) => {
  //     dispatch(setPushNotifiObj(notification));
  //     if (isAppOpen) {
  //       openDetail(notification);
  //     } else {
  //       setTimeout(() => {
  //         openDetail(notification);
  //       }, 3000);
  //     }
  //   });
  // };

  // const onNotificationListener = async () => {
  //   notifications.onNotification(async (notification: any) => {
  //     dispatch(setPushNotifiObj(notification));
  //     dispatch(setIsShowNoti(true));
  //   });
  // };

  // const openDetail = (notification: any) => {
  //   // if (Platform.OS == 'android') {
  //   //   setBadge(0);
  //   // }
  //   // let item = selector?.pushObj?._data || notification?._data;
  //   // if (item?.type === NOTIFICATION_TYPES.Order) {
  //   //   moveToScreen(navigation, Routes.Profile.orderDetail, {
  //   //     orderId: item?.orderId,
  //   //   });
  //   // } else if (item?.type === NOTIFICATION_TYPES.Rating) {
  //   //   moveToScreen(navigation, Routes.Setting.vendorRating, {
  //   //     isDisable: true,
  //   //     reviewId: item?.reviewId,
  //   //   });
  //   // } else if (item?.type == NOTIFICATION_TYPES.chat && item?.channelId) {
  //   //   ThreadManager.instance.getThreadCompleteObj(
  //   //     item?.channelId,
  //   //     (res: any) => {
  //   //       if (res?.participants) {
  //   //         moveToScreen(navigation, Routes.Chat.chatScreen, {
  //   //           thread: res,
  //   //         });
  //   //       }
  //   //     },
  //   //   );
  //   // }
  // };

  /////////////////

  return (
    <View style={AppStyles.MainStyle}>
      {selector?.isLoaderStart && <AppLoader />}
      {selector?.showToast?.message !== "" ? <ToastComp /> : null}
      {selector?.isAlertShow?.value && (
        <AlertModal
          visible={selector?.isAlertShow?.value}
          onPress={() => {
            dispatch(setIsAlertShow({ value: false, message: "" }));
          }}
          message={selector?.isAlertShow?.message}
        />
      )}
      {selector?.userData ? <MainNavigation /> : <AuthStack />}
      {selector?.showNoti ? (
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1,
            elevation: 5,
          }}
        >
          <SafeAreaView />
          <LocalNotification
            openView={() => {
              openDetail(null);
              dispatch(setIsShowNoti(false));
            }}
            closeView={() => {
              dispatch(setIsShowNoti(false));
            }}
          />
        </View>
      ) : null}
    </View>
  );
};

export default AppContainer;

const styles = StyleSheet.create({});
