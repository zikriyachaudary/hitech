import { Platform } from "react-native";
import CommonDataManager from "../../Utils/CommonManager";
import storage from "@react-native-firebase/storage";
import firestore, {
  FirebaseFirestoreTypes,
} from "@react-native-firebase/firestore";
import { AppStrings, Collections, ORDER_STATUS } from "../../Utils/AppStrings";

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

export const fetchAdminDetailReq = async (onComplete: any) => {
  try {
    const querySnapshot = await firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .get();
    querySnapshot.forEach((doc) => {
      onComplete(doc.data());
    });
  } catch (error) {
    onComplete(null);
    console.error("Error fetching vendor data", error);
  }
};

export const getDispatchedOrdersList = async (
  onComplete: any,
  lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null = null,
  limitCount: number = 12
) => {
  try {
    let query = firestore()
      .collection(Collections.ORDER_COLLECTION)
      .where("orderStatus", "==", ORDER_STATUS.Dispatched)
      .orderBy("createdAt", "desc")
      .limit(limitCount);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("snapshot.docs.length -->>>   ", snapshot.docs);

    onComplete({
      status: true,
      data: orders,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      isEnd: snapshot.empty,
    });
  } catch (error) {
    console.log("getDispatchedOrdersList --->>>", error);
    onComplete({ status: false, error });
  }
};

export const getPendingOrdersList = async (
  onComplete: any,
  lastDoc: FirebaseFirestoreTypes.DocumentSnapshot | null = null,
  limitCount: number = 12
) => {
  try {
    let query = firestore()
      .collection(Collections.ORDER_COLLECTION)
      .where("orderStatus", "!=", ORDER_STATUS.Dispatched)
      .orderBy("orderStatus")
      .orderBy("createdAt", "desc")
      .limit(limitCount);

    if (lastDoc) {
      query = query.startAfter(lastDoc);
    }

    const snapshot = await query.get();
    const orders = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

    onComplete({
      status: true,
      data: orders,
      lastDoc: snapshot.docs[snapshot.docs.length - 1] || null,
      isEnd: snapshot.empty,
    });
  } catch (error) {
    console.log("getPendingOrdersList --->>>", error);
    onComplete({ status: false, error });
  }
};
