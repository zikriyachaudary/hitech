import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, StatusBar, View } from "react-native";
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
  setIsRtl,
  setNetState,
  setUserData,
} from "./src/Redux/Reducers/AppReducers";
import AppContainer from "./src/AppContainer";
import DeviceInfo from "react-native-device-info";
import { GOOGLE_SIGNIN_KEY } from "./src/Network/Url";
import WelcomeScreen from "./src/UI/Sections/Welcome/Screens/WelcomeScreen";
import LinearGradient from "react-native-linear-gradient";
import { AppStyles } from "./src/Utils/AppStyles";
import { ScreenSize } from "./src/Utils/AppConstants";

import {
  BluetoothManager,
  BluetoothEscposPrinter,
} from "react-native-bluetooth-escpos-printer";
import PrintHelloScreen from "./src/HelloPrintScreen";

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
    }
  }, [fetching]);

  const fetchUser = async () => {
    let userDataa = await getUserDataAsync();
    if (userDataa?.userId) {
      dispatch(setUserData(userDataa));
    }
    if (userDataa?.isRtl) {
      dispatch(setIsRtl(true));
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

  // ------------------------->>

  // useEffect(() => {
  // requestBluetoothPermissions();
  // scanForDevices();
  // setTimeout(() => {
  //   connection();
  // }, 10000);
  // }, []);

  const requestBluetoothPermissions = async () => {
    if (Platform.OS === "android" && Platform.Version >= 31) {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, // for Android < 12
      ]);

      return Object.values(granted).every(
        (status) => status === PermissionsAndroid.RESULTS.GRANTED
      );
    }

    // For Android < 12 or iOS (if supported)
    return true;
  };

  const scanForDevices = async () => {
    const isGranted = await requestBluetoothPermissions();
    console.log("isGranted ---->>>>>  ", isGranted);

    if (!isGranted) return;

    try {
      const enabled = await BluetoothManager.enableBluetooth(); // prompt user
      const result = await BluetoothManager.scanDevices();
      const found = JSON.parse(result); // found is a list of devices
      console.log("Devices:", found);
    } catch (err) {
      console.warn("Bluetooth Error:", err);
    }
  };

  const connection = () => {
    console.log("--- conection ---- -- ");

    BluetoothManager.connect("7E:94:9B:76:4D:19") // the device address scanned.
      .then(
        (s: any) => {
          console.log("Connected to device:", s);
        },
        (e: any) => {
          console.log("Error connect --  ", e);
        }
      );
  };

  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <StatusBar
        animated={true}
        backgroundColor="#fff"
        barStyle={"dark-content"}
        showHideTransition={"fade"}
      />
      <NavigationContainer>
        <AppContainer />
      </NavigationContainer>
      {/* <PrintHelloScreen /> */}
    </View>
  );
};

export default App;
