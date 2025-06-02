import { useDispatch } from "react-redux";
import {
  fetchNotificationReq,
  sendPushNotificationReq,
} from "../Network/Services/NotificationServices";
import { setIsAlertShow, setIsLoader } from "../Redux/Reducers/AppReducers";
import {
  AppStrings,
  Collections,
  NOTIFICATIONS_TYPES,
} from "../Utils/AppStrings";
import firestore from "@react-native-firebase/firestore";
import { fetchFCMTokenById } from "../Network/Services/AuthServices";
import { fetchAdminListReq } from "../Network/Services/AdminGeneralServices";

const NotificationManager = () => {
  const dispatch = useDispatch();

  const updateNotificationList = async (userId: any, notification: any) => {
    await fetchNotificationReq(userId, async (response: any) => {
      if (response?.status) {
        const completeNotiList = [...response.data, notification];

        const docRef = firestore()
          .collection(Collections.NOTIFICATION_COLLECTION)
          .doc(userId);

        if (response.data?.length > 0) {
          docRef.update({ notification_List: completeNotiList });
        } else {
          docRef.set({
            userId,
            notification_List: completeNotiList,
          });
        }
      } else {
        dispatch(
          setIsAlertShow({
            value: true,
            message: AppStrings.Network.someThingError,
          })
        );
      }
    });
  };

  const updateNotificationFunc = async (singleObj: any) => {
    const { sender, reciver } = singleObj;
    console.log("singleObj -----   Before -------  ", singleObj);

    if (!sender?.userId) {
      return;
    }

    if (
      singleObj?.type === NOTIFICATIONS_TYPES.payment_Received ||
      singleObj?.type == NOTIFICATIONS_TYPES.Order_Placed
    ) {
      console.log(" ------- here -------");

      const adminNotification = { ...singleObj };
      await updateNotificationList(
        singleObj?.reciver?.userId,
        adminNotification
      );

      let completAdminList: any = [{ adminId: singleObj?.reciver?.userId }];
      const adminList: any = await fetchAdminListReq(
        singleObj?.reciver?.userId
      );
      completAdminList = [...completAdminList, ...adminList];

      if (completAdminList?.length > 0) {
        for (let index = 0; index < completAdminList.length; index++) {
          const element = completAdminList[index];
          if (element?.adminId) {
            const fcmToken = await fetchFCMTokenById(element?.adminId);
            if (fcmToken) {
              const pushNotificationBody = {
                message: {
                  token: fcmToken,
                  notification: {
                    body: adminNotification?.body,
                    title: adminNotification?.title,
                  },
                  data: {
                    type: singleObj?.type,
                  },
                },
              };
              const response: any = await sendPushNotificationReq(
                pushNotificationBody
              );
            }
          }
        }
      }
    } else if (
      singleObj?.type === NOTIFICATIONS_TYPES.Order_Dispatched ||
      singleObj?.type === NOTIFICATIONS_TYPES.Account_Upgraded
    ) {
      console.log("singleObj -----   ", singleObj);

      await updateNotificationList(singleObj?.reciver?.userId, singleObj);
      console.log(
        "singleObj?.reciver?.userId -------   ",
        singleObj?.reciver?.userId
      );

      if (singleObj?.reciver?.userId) {
        const fcmToken = await fetchFCMTokenById(singleObj?.reciver?.userId);
        console.log("fcmToken ------   ", fcmToken);

        if (fcmToken) {
          const pushNotificationBody = {
            message: {
              token: fcmToken,
              notification: {
                body: singleObj?.body,
                title: singleObj?.title,
              },
              data: {
                type: singleObj?.type,
              },
            },
          };
          console.log("pushNotificationBody -----    ", pushNotificationBody);

          const response: any = await sendPushNotificationReq(
            pushNotificationBody
          );
        }
      }
    }
  };

  return {
    updateNotificationFunc,
  };
};

export default NotificationManager;
