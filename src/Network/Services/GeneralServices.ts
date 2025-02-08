import { Platform } from "react-native";
import CommonDataManager from "../../Utils/CommonManager";
import storage from "@react-native-firebase/storage";
import firestore from "@react-native-firebase/firestore";
import { Collections } from "../../Utils/AppStrings";

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
