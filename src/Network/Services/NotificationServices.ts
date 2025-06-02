import { Collections } from "../../Utils/AppStrings";
import { BASE_URL } from "../Url";
import Api from "./Api";
import firestore from "@react-native-firebase/firestore";

export const sendPushNotificationReq = async (params: any) => {
  try {
    console.log("params -----   ", params);

    const urlForApiCall = BASE_URL + "sendPushNotification";
    const method = "POST";
    let apiRequest = await Api(urlForApiCall, method, params);
    return apiRequest;
  } catch (error: any) {
    console.log("sendPushNotificationReq Error ---->>   ", error);
    return { status: false, message: error?.message ?? error };
  }
};

export const fetchNotificationReq = async (userId: any, onComplete: any) => {
  try {
    const docs: any = await firestore()
      .collection(Collections.NOTIFICATION_COLLECTION)
      .doc(userId)
      .get();
    if (!docs.exists) {
      onComplete({ status: true, data: [] });
    }

    onComplete({
      status: true,
      data: docs?._data?.notification_List
        ? docs?._data?.notification_List
        : [],
    });
  } catch (error) {
    console.log("Error fetching notifications:", error);
    onComplete({ status: false, data: null });
  }
};
