import { Collections } from "../../Utils/AppStrings";
import firestore from "@react-native-firebase/firestore";

export const addAddressReq = async (
  userId: string,
  params: any,
  isUpdate: boolean,
  onComplete: (response: any) => void
) => {
  try {
    console.log("params --->>>  ", params);

    const userRef = firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      .doc(userId)
      .collection(Collections.DELIVERY_ADDRESS)
      .doc(
        params?.id ||
          firestore().collection(Collections.DELIVERY_ADDRESS).doc().id
      );

    if (isUpdate) {
      await userRef.update(params);
    } else {
      await userRef.set(params);
    }

    onComplete({ status: true, message: "Address saved successfully" });
  } catch (error) {
    console.log("addAddressReq Error --->>> ", error);
    onComplete({ status: false, message: "Failed to save address" });
  }
};

export const fetchAddressReq = async (
  userId: string,
  onComplete: (response: any) => void
) => {
  console.log("userId --- ", userId);

  try {
    const addressRef = firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      .doc(userId)
      .collection(Collections.DELIVERY_ADDRESS);

    const snapshot = await addressRef.get();

    if (snapshot.empty) {
      onComplete({ status: false, message: "No addresses found", data: [] });
      return;
    }

    const addresses = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    onComplete({ status: true, data: addresses });
  } catch (error) {
    console.log("fetchAddressReq Error --->>> ", error);
    onComplete({ status: false, message: "Failed to fetch addresses" });
  }
};
