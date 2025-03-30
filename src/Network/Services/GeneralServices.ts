import { Platform } from "react-native";
import CommonDataManager from "../../Utils/CommonManager";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { AppStrings, Collections } from "../../Utils/AppStrings";

export const uploadMedia = async (
  uri: string,
  onComplete: (url: string | null) => void
) => {
  const filename =
    CommonDataManager.getSharedInstance().makeid(6) +
    uri.substring(uri.lastIndexOf("/") + 1);
  const uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;
  const ref = storage().ref(filename);
  const task = ref.putFile(uploadUri);
  task.on("state_changed", (snapshot) => {});
  try {
    await task
      .then((item) => {
        ref.getDownloadURL().then((url) => {
          onComplete(url);
        });
      })
      .catch((error) => {
        onComplete(null);
      });
  } catch (e) {
    onComplete(null);
  }
};

export const addCategoryReq = async (params: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.CATEGORIES_COLLECTION)
      .doc(params?.id)
      .set(params)
      .then(() =>
        onComplete({ status: true, message: "Categories Added Successfully" })
      );
  } catch (error) {
    console.log("Error while adding categories --->>>   ", error);
    onComplete({ status: false, message: AppStrings.Network.someThingError });
  }
};

export const deleteCatReq = async (id: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.CATEGORIES_COLLECTION)
      .doc(id)
      .delete()
      .then(() => onComplete({ status: true, message: "Categories Deleted" }));
  } catch (error) {
    console.log("Error while adding categories --->>>   ", error);
    onComplete({ status: false, message: AppStrings.Network.someThingError });
  }
};

export const updateCategoryReq = async (params: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.CATEGORIES_COLLECTION)
      .doc(params?.id)
      .update(params)
      .then(() =>
        onComplete({ status: true, message: "Categories Added Successfully" })
      );
  } catch (error) {
    console.log("Error while adding categories --->>>   ", error);
    onComplete({ status: false, message: AppStrings.Network.someThingError });
  }
};

export const fetchCatListReq = async (onComplete: (result: any) => void) => {
  try {
    const snapshot = await firestore()
      .collection(Collections.CATEGORIES_COLLECTION)
      .get();

    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    onComplete({ status: true, data: categories });
  } catch (error) {
    console.log("Error --->>>", error);
    onComplete({ status: false, message: "Failed to fetch categories" });
  }
};

export const getUserOrdersList = async (userId: any, onComplete: any) => {
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
  } catch (error: any) {
    console.log("getUserOrdersList --->>>", error);
    onComplete({ status: false, error: error.message });
  }
};

export const getUserCompleteListReq = async (
  onComplete: (list: any, lastVisible: any) => void,
  lastVisible: any = null,
  limit: number = 10
) => {
  let userList: any = [];
  try {
    let query = firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      // .orderBy("createdAt")
      .limit(limit);

    if (lastVisible) {
      query = query.startAfter(lastVisible);
    }

    const querySnapshot = await query.get();

    querySnapshot.forEach((doc) => {
      let completeObj = {
        ...doc.data(),
      };
      if (completeObj?.isEmailVerified) {
        userList.push(completeObj);
      }
    });

    const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

    onComplete(userList, lastDoc);
  } catch (error) {
    console.error("Error fetching users with pagination:", error);
  }
};
export const getAllOrdersList = async (onComplete: any) => {
  try {
    const snapshot = await firestore()
      .collection(Collections.ORDER_COLLECTION)
      .get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    onComplete({ status: true, data: orders });
  } catch (error) {
    console.log("getAllOrdersList --->>>", error);
    onComplete({ status: false, error: error });
  }
};
