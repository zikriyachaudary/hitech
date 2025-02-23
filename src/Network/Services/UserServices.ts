import firestore from "@react-native-firebase/firestore";
import { Collections } from "../../Utils/AppStrings";

export const getAllUsersReq = async (onComplete: any) => {
  try {
    const snapshot = await firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      .get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    onComplete({ status: true, data: users });
  } catch (error) {
    console.log("error =--0---  ", error);
    onComplete({ status: false, data: [] });
  }
};

export const getOrdersByUserId = async (userId: any, onComplete: any) => {
  try {
    const snapshot = await firestore()
      .collection(Collections.ORDER_COLLECTION)
      .where("userDetail.userId", "==", userId)
      .get();
    const orders = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    onComplete({ status: true, data: orders });
  } catch (error) {
    console.log("error =--0---  ", error);
    onComplete({ status: false, data: [] });
  }
};
