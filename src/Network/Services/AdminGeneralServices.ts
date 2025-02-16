import { AppStrings, Collections } from "../../Utils/AppStrings";
import firestore from "@react-native-firebase/firestore";

export const fetchAdminListReq = async (superAdminId: any) => {
  try {
    const querySnapshot = await firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .doc(superAdminId)
      .collection(Collections.ADMIN_LIST)
      .get();
    const admin = querySnapshot.docs.map((doc) => doc.data());
    return admin;
  } catch (e) {
    console.log(e);
  }
};

export const addAdminInToSuperAdminReq = async (adminObj: any) => {
  try {
    await firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .doc(adminObj?.userId)
      .collection(Collections.ADMIN_LIST)
      .doc(adminObj?.adminId)
      .set(adminObj);

    return adminObj;
  } catch (e) {
    console.log(e);
  }
};

export const updateAdminInToSuperAdminReq = async (adminObj: any) => {
  try {
    await firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .doc(adminObj?.userId)
      .collection(Collections.ADMIN_LIST)
      .doc(adminObj?.adminId)
      .update(adminObj);

    return adminObj;
  } catch (e) {
    console.log(e);
  }
};

export const deleteAdminInToSuperAdminReq = async (adminObj: any) => {
  try {
    await firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .doc(adminObj?.userId)
      .collection(Collections.ADMIN_LIST)
      .doc(adminObj?.adminId)
      .delete();
  } catch (e) {
    console.log(e);
  }
};

export const findAdminByEmail = async (params: any) => {
  try {
    const superAdminsSnapshot = await firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .get();

    const superAdmin = superAdminsSnapshot.docs[0]?.data();
    if (!superAdmin?.userId) {
      throw new Error("Super admin not found");
    }

    const adminListSnapshot = await firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .doc(superAdmin.userId)
      .collection(Collections.ADMIN_LIST)
      .get();

    const adminList = adminListSnapshot.docs.map((doc) => doc.data());

    const matchedAdmin = adminList.find(
      (admin: any) => admin?.email === params.email
    );

    if (matchedAdmin?.pinCode == params.otp) {
      return matchedAdmin;
    } else {
      return {
        status: false,
        message: "Invalid Credentials",
      };
    }
  } catch (e) {
    console.error(e);
    return null;
  }
};

export const updateAdminReq = async (params: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .doc(params?.adminId)
      .update(params)
      .then(() => {
        onComplete({ status: true, message: "Updated Successfully" });
      })
      .catch((e) => {
        onComplete({
          status: false,
          message: AppStrings.Network.tryAgainLater,
        });
      });
  } catch (error) {
    console.log("error --->>  ", error);
    onComplete({ status: false, message: AppStrings.Network.someThingError });
  }
};

export const updateSubAdminReq = async (params: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.ADMIN_COLLECTION)
      .doc(params?.userId)
      .collection(Collections.ADMIN_LIST)
      .doc(params?.adminId)
      .update(params)
      .then(() => {
        onComplete({ status: true, message: "Updated Successfully" });
      })
      .catch((e) => {
        onComplete({
          status: false,
          message: AppStrings.Network.tryAgainLater,
        });
      });
  } catch (error) {
    console.log("error --->>  ", error);
    onComplete({ status: false, message: AppStrings.Network.someThingError });
  }
};
