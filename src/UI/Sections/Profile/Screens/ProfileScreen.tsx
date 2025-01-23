import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import { setUserData } from "../../../../Redux/Reducers/AppReducers";
import { setUserDataInAsync } from "../../../../Utils/AsyncStorage";
import { useDispatch, useSelector } from "react-redux";
import {
  AppColors,
  AppFonts,
  normalized,
  profileBarList,
} from "../../../../Utils/AppConstants";
import { AppStyles } from "../../../../Utils/AppStyles";
import AppImageViewer from "../../../Components/AppImageView";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import ProfileBar from "../Components/ProfileBar";

const ProfileScreen = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );

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

      <ProfileBar List={profileBarList} setValue={(id: any) => {}} />
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
});
