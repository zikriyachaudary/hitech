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
import { setTab, setUserData } from "../../../../Redux/Reducers/AppReducers";
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
import ProfileList from "../Components/ProfileList";
import SimpleHeader from "../../../Components/CustomHeader/SimpleHeader";

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
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <SimpleHeader title={"Profile"} />
      <View style={{ height: normalized(20) }} />
      <View style={styles.profileImgCont}>
        <AppImageViewer
          source={{
            uri:
              selector?.userData?.profileImage || selector?.userData?.profile,
          }}
          style={styles.profileImg}
          resizeMode="cover"
        />
      </View>
      <Text style={styles.username}>
        {CommonDataManager?.getSharedInstance()?.capitalizeEachWord(
          userData?.fullName || userData?.firstName + " " + userData?.lastName
        )}
      </Text>

      <ProfileList
        List={isAdmin ? adminProfileList : profileBarList}
        setValue={(id: any) => {
          if (id == 1) {
            props?.navigation?.navigate(Routes.Home.EditProfile);
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
    borderRadius: normalized(8),
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
  profileImgCont: {
    width: normalized(130),
    height: normalized(130),
    borderRadius: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    // borderStyle: "dashed",
    alignSelf: "center",
    resizeMode: "contain",
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
  },
});
