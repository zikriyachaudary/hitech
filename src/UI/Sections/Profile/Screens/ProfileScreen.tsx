import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import {
  setIsAlertShow,
  setIsLoader,
  setTab,
  setUserData,
} from "../../../../Redux/Reducers/AppReducers";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  adminProfileList,
  AppColors,
  AppFonts,
  hv,
  Modal_Type,
  normalized,
  profileBarList,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import AppImageViewer from "../../../Components/AppImageView";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import ProfileBar from "../Components/ProfileBar";
import LogoutModal from "../Components/LogoutModal";
import { Routes } from "../../../../Utils/Routes";
import CommonDataManager from "../../../../Utils/CommonManager";
import { AppStrings } from "../../../../Utils/AppStrings";
import ThreadManager from "../../../../ChatModule/ThreadManger";

const ProfileScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isAdmin = selector?.userData?.isAdmin;
  const userData = selector?.userData || null;
  const [openLogoutModal, setOpenLogoutModal] = useState({
    value: false,
    type: "",
  });

  const onLogoutPress = () => {
    dispatch(setUserData(null));
    dispatch(setTab(0));
    setUserDataInAsync({ isRtl: true });
  };
  const dispatch = useDispatch();

  /////////////////////////////

  const goToChat = async (otherUserData: any) => {
    if (!selector?.isNetConnected) {
      dispatch(
        setIsAlertShow({
          value: true,
          message: AppStrings.Network.internetError,
        })
      );
      return;
    }
    let threadObj = null;
    ThreadManager.instance.checkIsConnectionExist(
      selector?.userData?.userId,
      otherUserData?.userId,
      (threadData: any) => {
        threadObj = threadData;
      }
    );
    if (threadObj) {
      props?.navigation.navigate(Routes.Chat.ChatScreen, {
        thread: threadObj,
      });
    } else {
      let senderObj: any = {
        id: selector?.userData?.userId?.toString(),
        _id: selector?.userData?.userId?.toString(),
        image: selector?.userData?.profile_Image,
        username: selector?.userData?.fullName,
      };
      let reciverObj: any = {
        id: otherUserData?.userId,
        _id: otherUserData?.userId,
        image: otherUserData?.profileImage,
        username: otherUserData?.fullName,
      };

      dispatch(setIsLoader(true));
      let msg = "";
      let docId = ThreadManager.instance.makeId(7);
      await ThreadManager.instance.onSendCall(
        senderObj,
        reciverObj,
        docId,
        msg,
        async (data: any) => {
          dispatch(setIsLoader(false));
          if (data != "error") {
            dispatch(setIsLoader(true));
            dispatch(setIsLoader(false));
            props?.navigation.push(Routes.Chat.ChatScreen, {
              thread: data,
            });
          } else {
            alert(JSON.stringify(data));
          }
        }
      );
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <Text style={styles.profile}>Profile</Text>
      <View style={{ height: normalized(20) }} />
      <AppImageViewer
        source={{
          uri: selector?.userData?.profileImage || selector?.userData?.profile,
        }}
        style={styles.profileImg}
        resizeMode="cover"
      />
      <Text style={styles.username}>
        {CommonDataManager?.getSharedInstance()?.capitalizeEachWord(
          userData?.fullName || userData?.firstName + " " + userData?.lastName
        )}
      </Text>
      <ProfileBar
        List={isAdmin ? adminProfileList : profileBarList}
        setValue={(id: any) => {
          if (id == 1) {
            let obj = {
              email: "testing@yopmail.com",
              fullName: "Testing User",
              phoneNumber: "+923244701915",
              profileImage:
                "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/KPXaHR9D96ED07-63BE-4F4D-846B-7895376E50C3.jpg?alt=media&token=32340295-3a0d-41a7-abc5-9a744cdf9802",
              secretId: "12345678",
              userId: "mF6Mz23i",
              userType: "Silver",
            };

            goToChat(obj);

            // props?.navigation?.navigate(Routes.Home.EditProfile);
          } else if (id == 2) {
            props?.navigation?.navigate(Routes.Home.DeliveryAddress);
          } else if (id == 3) {
            props?.navigation?.navigate(Routes.Home.cartScreen);
          } else if (id == 4) {
            setOpenLogoutModal({
              value: true,
              type: Modal_Type.deleteAccount,
            });
          } else if (id == 5) {
            setOpenLogoutModal({
              value: true,
              type: Modal_Type.logout,
            });
          } else if (id == 6) {
            props?.navigation?.navigate(Routes.Home.Language);
          }
        }}
      />
      {openLogoutModal?.value && (
        <LogoutModal
          type={openLogoutModal?.type}
          onClose={() => {
            setOpenLogoutModal({
              value: false,
              type: "",
            });
          }}
          onLogout={(password: any) => {
            if (openLogoutModal?.type === Modal_Type.logout) {
              onLogoutPress();
            } else if (openLogoutModal?.type === Modal_Type.deleteAccount) {
              // _deleteAccount();
            }
            setOpenLogoutModal({
              value: false,
              type: "",
            });
          }}
        />
      )}
    </View>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  profile: {
    fontSize: normalized(20),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsSemiBold,
    alignSelf: "center",
  },
  profileImg: {
    width: normalized(120),
    height: normalized(120),
    borderRadius: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    borderStyle: "dashed",
    alignSelf: "center",
    resizeMode: "contain",
    overflow: "hidden",
  },
  username: {
    marginVertical: hv(5),
    color: AppColors.black.black,
    fontSize: normalized(15),
    fontFamily: AppFonts.PoppinsMedium,
    alignSelf: "center",
  },
});
