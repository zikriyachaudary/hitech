import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";
import { AppStrings, Collections } from "../../Utils/AppStrings";
import CommonDataManager from "../../Utils/CommonManager";
import { BASE_URL } from "../Url";
import { ApiResponseHandler } from "./ApiResponseHandler";
import Api from "./Api";
import { formatPhoneNumber } from "../../Utils/Helper";

export const userSignupRequest = async (
  userInput: any,
  getResponse: (userObj: any) => void
) => {
  let id = CommonDataManager.getSharedInstance().makeid(8);
  try {
    await auth()
      .createUserWithEmailAndPassword(
        userInput.email.toLocaleLowerCase(),
        userInput.password
      )
      .then(async () => {
        let loginObj = {
          ...userInput,
          secretId: userInput?.password,
          userId: id,
        };

        delete loginObj["password"];

        await firestore()
          .collection(Collections.CUSTOMERS_COLLECTION)
          .doc(id)
          .set(loginObj)
          .then((docRef) => {
            getResponse({ status: true, data: loginObj });
          })
          .catch((error) => {
            console.log("Error at adding user ", error);
            getResponse({ status: false, message: "" });
          });
      })
      .catch((error) => {
        let errorMsg = "";
        if (error.code === "auth/email-already-in-use") {
          errorMsg = AppStrings.Network.emailAlreadyUse;
        } else if (error.code === "auth/invalid-email") {
          errorMsg = AppStrings.Network.invalidEmail;
        } else if (error.code === "auth/user-not-found") {
          errorMsg = AppStrings.Network.userNotFound;
        }
        getResponse({ status: false, message: errorMsg });
      });
  } catch (e) {
    console.log(e);
    getResponse({ status: false, message: e });
  }
};

export const signinReqWithPhoneNumber = async (
  phoneNumber: any,
  getResponse: (userObj: any) => void
) => {
  try {
    console.log("phoneNumber -----  ", phoneNumber);

    await auth()
      .signInWithPhoneNumber(phoneNumber)
      .then(async (obj) => {
        getResponse({ status: true, data: obj });
      });
  } catch (error) {
    console.log("Error while singup with phone number --->>  ", error);
    getResponse({ status: false, message: error });
  }
};

export const loginRequest = async (
  userInput: any,
  complete: (userObj: any) => void
) => {
  try {
    firestore()
      .collection(
        userInput?.isAdmin
          ? Collections.ADMIN_COLLECTION
          : Collections.CUSTOMERS_COLLECTION
      )
      .where(userInput?.key, "==", userInput?.email?.toLocaleLowerCase())
      .where("secretId", "==", userInput?.password)
      .get()
      .then((querySnapshot: any) => {
        if (querySnapshot?._docs?.length == 0) {
          complete({ status: false, message: "Invalid Credentials" });
        } else {
          querySnapshot.forEach(async (doc: any) => {
            let loginObj = {
              ...doc.data(),
            };
            complete({ status: true, data: loginObj });
          });
        }
      })
      .catch((error) => {
        console.log("Error while getting data", error);
        complete({ status: false, message: error });
      });
  } catch (error: any) {
    console.log(" Login error ==>>>>  ", error);

    let errorMsg = "Invalid Credentials";
    console.log("error?.code => ", error?.code);
    if (error?.code === "auth/user-not-found") {
      errorMsg = AppStrings.Network.userNotFound;
    } else if (error?.code == "auth/wrong-password") {
      errorMsg = AppStrings.Network.invalidPassword;
    } else if (error?.code == "auth/too-many-requests") {
      errorMsg = AppStrings.Network.tryAgainLater;
    }
    complete({ status: false, message: errorMsg });
  }
};

export const logoutRequest = async () => {
  try {
    await auth().signOut();
  } catch (e) {
    console.log(e);
  }
};

export const socialAuthCheckRequest = async (
  userInput: any,
  onComplete: any
) => {
  await auth()
    .createUserWithEmailAndPassword(
      userInput.email.toLocaleLowerCase(),
      userInput.password
    )
    .then(async () => {
      onComplete({ status: true, message: "user not Exist" });
    })
    .catch((error) => {
      let errorMsg = "";
      if (error.code === "auth/email-already-in-use") {
        errorMsg = AppStrings.Network.emailAlreadyUse;
      } else if (error.code === "auth/invalid-email") {
        errorMsg = AppStrings.Network.invalidEmail;
      } else if (error.code === "auth/user-not-found") {
        errorMsg = AppStrings.Network.userNotFound;
      }
      onComplete({ status: false, message: errorMsg });
    });
};

export const checkUserInCollection = async (
  userInput: any,
  onComplete: any
) => {
  await firestore()
    .collection(Collections.CUSTOMERS_COLLECTION)
    .where("socialId", "==", userInput?.password)
    .get()
    .then((querySnapshot: any) => {
      if (querySnapshot?._docs?.length == 0) {
        onComplete({ status: false, message: "" });
      } else {
        querySnapshot.forEach(async (doc: any) => {
          let loginObj = {
            ...doc.data(),
          };
          onComplete({ status: true, data: loginObj });
        });
      }
    })
    .catch((error) => {
      console.log("Error while getting data", error);
      onComplete({ status: false, message: error });
    });
};

export const createNewSocialUser = async (userInput: any, getResponse: any) => {
  let id = CommonDataManager.getSharedInstance().makeid(8);
  let loginObj = {
    ...userInput,
    userId: id,
  };
  delete loginObj["password"];
  await firestore()
    .collection(Collections.CUSTOMERS_COLLECTION)
    .doc(id)
    .set(loginObj)
    .then((docRef) => {
      getResponse({ status: true, data: loginObj });
    })
    .catch((error) => {
      console.log("Error at adding user ", error);
      getResponse({ status: false, message: "" });
    });
};
export const updatedUserReq = async (
  userId: string,
  fieldsToUpdate: any,
  getResponse: (response: any) => void
) => {
  try {
    await firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      .doc(userId)
      .update(fieldsToUpdate)
      .then(() => {
        getResponse({ status: true, message: "User updated successfully" });
      })
      .catch((error) => {
        console.log("Error updating user: ", error);
        getResponse({ status: false, message: "Error updating user" });
      });
  } catch (e: any) {
    console.log("e.message --->>>>  ", e.message);

    getResponse({ status: false, message: e.message });
  }
};

export const updateFCMTokenReq = async (userId: string, token: any) => {
  try {
    await firestore()
      .collection(Collections.FCM_COLLECTION)
      .doc(userId)
      .set({ userId: userId, token: token })
      .then(() => {
        console.log("updated FCM successfully!");
      })
      .catch((error) => {
        console.log("Error updating:------> ", error);
      });
  } catch (e: any) {
    console.log("updated FCM error!----", e.message);
  }
};

export const delFCMTokenReq = async (userId: string) => {
  try {
    await firestore()
      .collection(Collections.FCM_COLLECTION)
      .doc(userId)
      .delete();
  } catch (e: any) {
    console.log("updated FCM error!----", e.message);
  }
};

export const fetchFCMTokenById = async (userId: any) => {
  return await firestore()
    .collection(Collections.FCM_COLLECTION)
    .doc(userId)
    .get()
    .then((doc: any) => {
      return doc?.data()?.token || "";
    })
    .catch((err: any) => {
      console.error(err);
      return "";
    });
};

export const deleteUserAccount = async (
  userId: any,
  password: string,
  onComplete: any
) => {
  try {
    const user: any = auth().currentUser;
    if (user) {
      if (password) {
        const credential = auth.EmailAuthProvider.credential(
          user?.email,
          password
        );
        await user.reauthenticateWithCredential(credential);
      }
      await user.delete();
      await firestore()
        .collection(Collections.CUSTOMERS_COLLECTION)
        .doc(userId)
        .delete();
      onComplete({ status: true, message: "User delete successfully" });
    } else {
      await firestore()
        .collection(Collections.CUSTOMERS_COLLECTION)
        .doc(userId)
        .delete();
      onComplete({ status: true, message: "No user is currently signed in" });
    }
  } catch (error) {
    onComplete({ status: false, message: error });
    console.error("Error deleting user account:", error);
  }
};

export const getSocialAuthReq = async (
  authCredentials: any,
  onComplete: any
) => {
  firestore()
    .collection(Collections.SOCIAL_AUTH_CREDENTIALS)
    .where("password", "==", authCredentials?.password)
    .get()
    .then(async (querySnapshot: any) => {
      if (querySnapshot?._docs?.length == 0) {
        await firestore()
          .collection(Collections.SOCIAL_AUTH_CREDENTIALS)
          .doc(authCredentials?.password)
          .set(authCredentials)
          .then((docRef) => {
            onComplete({ status: true, data: authCredentials });
          })
          .catch((error) => {
            onComplete({ status: false, data: null });
          });
      } else {
        querySnapshot.forEach(async (doc: any) => {
          let detail = doc.data();
          if (
            (!detail?.email && authCredentials?.email) ||
            (authCredentials?.firstName && authCredentials?.lastName)
          ) {
            await firestore()
              .collection(Collections.SOCIAL_AUTH_CREDENTIALS)
              .doc(authCredentials?.password)
              .update(authCredentials)
              .then((docRef) => {
                onComplete({ status: true, data: authCredentials });
              })
              .catch((error) => {
                onComplete({ status: false, data: null });
              });
          } else {
            onComplete({ status: true, data: doc.data() });
          }
        });
      }
    });
};

export const isEmailAlreadyRegistered = async (
  email: any,
  query = "email",
  onComplete: any
) => {
  try {
    const snapshot = await firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      .where(query, "==", email)
      .get();

    if (snapshot.empty) {
      console.log("No matching documents found.");
      onComplete({ status: false });
    }

    snapshot.forEach((doc) => {
      onComplete({ status: true });
    });

    return true;
  } catch (error) {
    console.log("Error --->>>>  ", error);
    return false;
  }
};

export const sendEmailOtp = async <T>(
  params: any
): Promise<ApiResponseHandler<T>> => {
  const urlForApiCall = BASE_URL + "sendOtp";
  const method = "POST";
  let apiRequest = await Api(urlForApiCall, method, params);
  return apiRequest;
};

export const verifyEmailOtp = async <T>(
  params: any
): Promise<ApiResponseHandler<T>> => {
  const urlForApiCall = BASE_URL + "verifyOtp";
  const method = "POST";
  let apiRequest = await Api(urlForApiCall, method, params);
  return apiRequest;
};

export const updateUserPasswordReq = async (obj: any, onComplete: any) => {
  try {
    const { secretId, email, phoneNumber } = obj;
    const collectionRef = firestore().collection(
      Collections.CUSTOMERS_COLLECTION
    );

    let query;

    if (email) {
      query = collectionRef.where("email", "==", email);
    } else if (phoneNumber) {
      query = collectionRef.where(
        "phoneNumber",
        "==",
        formatPhoneNumber(phoneNumber)
      );
    } else {
      onComplete({
        status: false,
        message: "No identifier provided for update",
      });
      return;
    }

    const snapshot = await query.get();

    if (!snapshot.empty) {
      const docRef = snapshot.docs[0].ref;

      await docRef.update({ secretId });

      onComplete({
        status: true,
        message: "Password Updated Successfully",
      });
    } else {
      onComplete({
        status: false,
        message: "User not found",
      });
    }
  } catch (error) {
    console.log("Password update error -->>>", error);
    onComplete({
      status: false,
      message: AppStrings.Network.someThingError,
    });
  }
};

export const changePasswordReq = async (obj: any, onComplete: any) => {
  try {
    firestore()
      .collection(Collections.CUSTOMERS_COLLECTION)
      .doc(obj?.userId)
      .update({ secretId: obj?.secretId })
      .then(() => {
        onComplete({ status: true, message: "Password Updated Successfully" });
      })
      .catch((e) => {
        onComplete({
          status: false,
          message: AppStrings.Network.someThingError,
        });
      });
  } catch (error) {
    console.log("order update Status error -->>>  ", error);
    onComplete({ status: false, message: AppStrings.Network.someThingError });
  }
};
