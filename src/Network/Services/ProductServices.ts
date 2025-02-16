import firestore from "@react-native-firebase/firestore";
import { AppStrings, Collections } from "../../Utils/AppStrings";

export const uploadProductToFireStore = async (obj: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.PRODUCTS_COLLECTION)
      .doc(obj?.id)
      .set(obj)
      .then(() => {
        onComplete({ status: true, data: obj });
      });
  } catch (error) {
    console.log("Error --->>>   ", error);
    onComplete({ status: false, data: "" });
  }
};

export const updateProduct = async (obj: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.PRODUCTS_COLLECTION)
      .doc(obj?.id)
      .update(obj)
      .then(() => {
        onComplete({ status: true, data: obj });
      });
  } catch (error) {
    console.log("Error --->>>   ", error);
    onComplete({ status: false, data: "" });
  }
};

export const fetchAllProducts = async (onComplete: any) => {
  try {
    const snapshot = await firestore()
      .collection(Collections.PRODUCTS_COLLECTION)
      .get();
    const products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    onComplete({ status: true, data: products });
  } catch (error) {
    console.error("Error --->>>", error);
    onComplete({ status: false, data: [] });
  }
};

export const deleteProductReq = async (id: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.PRODUCTS_COLLECTION)
      .doc(id)
      .delete()
      .then(() => {
        onComplete({ status: true, message: "Product Deleted" });
      });
  } catch (error) {
    console.error("Error --->>>", error);
    onComplete({
      status: false,
      message: "Something Wrong. Check your internet connection",
    });
  }
};

export const placeOrderReq = async (params: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.ORDER_COLLECTION)
      .doc(params?.orderId)
      .set(params)
      .then(() => {
        onComplete({ status: true, message: "Order Placed Successfully" });
      })
      .catch((e) => {
        onComplete({
          status: false,
          message: AppStrings.Network.someThingError,
        });
      });
  } catch (error) {
    console.log("order placed error -->>>  ", error);
    onComplete({ status: false, message: AppStrings.Network.someThingError });
  }
};
