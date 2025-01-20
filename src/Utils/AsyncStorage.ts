import AsyncStorage from "@react-native-async-storage/async-storage";
import { AsyncKeyStrings } from "./AppStrings";

export const setUserDataInAsync = async (data: any) => {
  try {
    await AsyncStorage.setItem(
      AsyncKeyStrings.Auth.userdata,
      JSON.stringify(data)
    );
  } catch (e) {
    console.log("Error storing userdata", e);
  }
};

export const getUserDataAsync = async () => {
  try {
    const userData = await AsyncStorage.getItem(AsyncKeyStrings.Auth.userdata);
    let data = userData != null ? JSON.parse(userData) : null;
    return data;
  } catch (e) {
    console.log("Error. . . ");
    return false;
  }
};

export const clearUserData = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    console.log("Error. . . ");
    return false;
  }
};

export const getUserToken = async () => {
  try {
    let t = await AsyncStorage.getItem(AsyncKeyStrings.Auth.userToken);
    if (t) {
      return t;
    } else {
      return null;
    }
  } catch (e) {
    console.log("Error", e);
    return null;
  }
};

export const saveUserToken = async (token: string) => {
  try {
    await AsyncStorage.setItem(AsyncKeyStrings.Auth.userToken, token);
  } catch (e) {
    console.log("Error storing usertoken", e);
  }
};
