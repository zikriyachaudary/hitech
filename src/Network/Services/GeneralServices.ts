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

export const addAddressReq = async (
  userId: string,
  params: any,
  isUpdate: boolean,
  onComplete: (response: any) => void
) => {
  try {
    const userRef = firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      .doc(userId);
    const userDoc = await userRef.get();

    let existingAddresses = [];
    if (userDoc.exists) {
      const userData = userDoc.data();
      existingAddresses = userData?.addresses || [];
    }

    if (isUpdate) {
      const addressIndex = existingAddresses.findIndex(
        (address) => address.id === params.id
      );

      if (addressIndex === -1) {
        return onComplete({
          status: false,
          message: "Address not found for update.",
        });
      }
      existingAddresses[addressIndex] = {
        ...existingAddresses[addressIndex],
        ...params,
      };
      await userRef.update({ addresses: existingAddresses });
      return onComplete({
        status: true,
        message: "Address updated successfully.",
        address: existingAddresses,
      });
    } else {
      const isDuplicate = existingAddresses.some((address: any) =>
        Object.keys(params).every((key) => address[key] === params[key])
      );

      if (isDuplicate) {
        return onComplete({
          status: false,
          message: "Address already exists.",
        });
      }
      existingAddresses.push(params);
      await userRef.update({ addresses: existingAddresses });
      return onComplete({
        status: true,
        message: "Address added successfully.",
        address: existingAddresses,
      });
    }
  } catch (error: any) {
    console.error("onAddAddressReq Error --->>>", error);
    onComplete({
      status: false,
      message: error.message || "Something went wrong",
    });
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

export const updateCategoryReq = async (params: any, onComplete: any) => {
  try {
    console.log("update cat pararams ---->>   ", params);

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

export const fetchCatListReq = (onComplete: (result: any) => void) => {
  return firestore()
    .collection(Collections.CATEGORIES_COLLECTION)
    .onSnapshot(
      (snapshot) => {
        const categories = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        onComplete({ status: true, data: categories });
      },
      (error) => {
        console.log("Error --->>>", error);
        onComplete({ status: false, message: "Failed to fetch categories" });
      }
    );
};
