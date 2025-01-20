import React, { useEffect, useState } from "react";
import { StatusBar, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import NetInfo from "@react-native-community/netinfo";
import SplashScreen from "react-native-splash-screen";
import CommonDataManager from "./src/Utils/CommonManager";
import { AppRootStore } from "./src/Redux/store/AppStore";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import Geocoder from "react-native-geocoding";
import { getUserDataAsync } from "./src/Utils/AsyncStorage";
import {
  setIsNotchBar,
  setNetState,
  setUserData,
} from "./src/Redux/Reducers/AppReducers";
import AppContainer from "./src/AppContainer";
import DeviceInfo from "react-native-device-info";
import { GOOGLE_MAP_KEY, GOOGLE_SIGNIN_KEY } from "./src/Network/Url";
const App = () => {
  const dispatch = useDispatch();
  const [fetching, setFetching] = useState(true);
  const [stripPublicURL, setStripPublicURL] = useState("");
  const selector = useSelector((state: AppRootStore) => state);

  const initialSetup = async () => {
    GoogleSignin.configure({
      webClientId: GOOGLE_SIGNIN_KEY,
    });
  };
  useEffect(() => {
    fetchUser();
    onAppStart();
    initialSetup();
    CommonDataManager.getSharedInstance().setReduxReducer(selector, dispatch);
  }, []);
  useEffect(() => {
    if (fetching) {
      Geocoder.init(GOOGLE_MAP_KEY);
    }
  }, [fetching]);

  const fetchUser = async () => {
    let userDataa = await getUserDataAsync();
    if (userDataa) {
      dispatch(setUserData(userDataa));
    }
  };

  const onAppStart = async () => {
    await checkInternet();
    await checkNotch();
    setTimeout(() => {
      SplashScreen.hide();
      setFetching(false);
    }, 2000);
  };

  const checkInternet = async () => {
    await NetInfo.addEventListener((state: any) => {
      dispatch(setNetState(state.isConnected));
    });
  };

  const checkNotch = async () => {
    const notch = await DeviceInfo.hasNotch();
    dispatch(setIsNotchBar(notch));
  };

  return (
    <View style={{ flex: 1 }}>
      <StatusBar
        animated={true}
        backgroundColor="#fff"
        barStyle={"dark-content"}
        showHideTransition={"fade"}
      />
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
    </View>
  );
};

export default App;
