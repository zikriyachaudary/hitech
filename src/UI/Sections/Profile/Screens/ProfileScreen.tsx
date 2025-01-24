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

const ProfileScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const [openLogoutModal, setOpenLogoutModal] = useState({
    value: false,
    type: "",
  });

  const onLogoutPress = () => {
    dispatch(setUserData(null));
    dispatch(setTab(0));
    setUserDataInAsync(null);
  };

  const dispatch = useDispatch();
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <Text style={styles.profile}>Profile</Text>
      <View style={{ height: normalized(20) }} />
      <AppImageViewer
        source={{ uri: selector?.userData?.profile }}
        style={styles.profileImg}
        resizeMode="cover"
      />
      <Text style={styles.username}>Zikriya Chaudary</Text>
      <ProfileBar
        List={profileBarList}
        setValue={(id: any) => {
          if (id == 1) {
            // props?.navigation?.navigate(Routes.Profile.editProfile);
          } else if (id == 2) {
            // props?.navigation?.navigate(Routes.Profile.delieryAddress);
          } else if (id == 3) {
            setOpenLogoutModal({
              value: true,
              type: Modal_Type.deleteAccount,
            });
          } else if (id == 4) {
            setOpenLogoutModal({
              value: true,
              type: Modal_Type.logout,
            });
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
