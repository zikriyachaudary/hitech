import React, { useEffect, useState } from "react";
import {
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { useIsFocused } from "@react-navigation/native";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import {
  setAdminUsersList,
  setIsLoader,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { Routes } from "../../../../Utils/Routes";
import {
  deleteAdminInToSuperAdminReq,
  fetchAdminListReq,
} from "../../../../Network/Services/AdminGeneralServices";

const AddAdminScreen = (props: ScreenProps) => {
  const selector = useSelector((state: AppRootStore) => state.SliceReducer);

  const isRtl = selector?.isRtl;

  const isFocused = useIsFocused();
  const dispatch = useDispatch();
  const [adminList, setAdminList] = useState([]);

  useEffect(() => {
    if (selector?.userData?.userId) fetchAdminList();
  }, [isFocused]);

  const fetchAdminList = async () => {
    if (!selector?.adminUsersList[0]) {
      dispatch(setIsLoader(true));
    }
    const list: any = await fetchAdminListReq(selector?.userData?.userId);
    dispatch(setIsLoader(false));
    setAdminList(list ?? []);
    dispatch(setAdminUsersList(list ?? []));
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => {
          props?.navigation?.goBack();
        }}
        title={isRtl ? "ایڈمنز" : "Admins"}
        icon={[AppImages.Home.PlusBlack]}
        onRightIconPress={() => props?.navigation?.navigate(Routes.OtpScreen)}
        rightIconCont={{
          width: normalized(33),
          height: normalized(33),
          borderColor: AppColors.themeColor.dark,
          borderRadius: normalized(40),
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: AppColors.themeColor.dark,
        }}
        rightIconStyle={{
          width: normalized(20),
          height: normalized(20),
          tintColor: AppColors.white.white,
        }}
      />
      {adminList?.length > 0 ? (
        <FlatList
          data={adminList}
          style={{ flex: 1, margin: AppHorizontalMargin }}
          keyExtractor={(index) => `${index}`}
          showsVerticalScrollIndicator={false}
          renderItem={({ item, index }: any) => {
            return (
              <TouchableOpacity
                activeOpacity={1}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  backgroundColor: AppColors.grey.greyLevel1,
                  borderRadius: 15,
                  padding: 10,
                  marginVertical: 10,
                }}
              >
                <View style={{ gap: normalized(5) }}>
                  <Text
                    style={{
                      fontSize: normalized(16),
                      color: AppColors.black.black,
                      fontFamily: AppFonts.PoppinsMedium,
                    }}
                  >
                    {item?.firstName + " " + item?.lastName}
                  </Text>
                  <Text
                    style={{
                      fontSize: normalized(14),
                      color: AppColors.grey.greyLevel7,
                      fontFamily: AppFonts.PoppinsMedium,
                    }}
                  >
                    {item?.email}
                  </Text>
                </View>
                <View style={styles.ratingCont}>
                  <TouchableOpacity
                    style={styles.btnCont}
                    activeOpacity={0.7}
                    onPress={() => {
                      props?.navigation?.navigate(Routes.OtpScreen, {
                        adminObj: item,
                      });
                    }}
                  >
                    <Text style={styles.btnTxt}>
                      {isRtl ? "ترمیم کریں" : "Edit"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    style={{
                      ...styles.btnCont,
                      backgroundColor: AppColors.red.dark,
                    }}
                    onPress={async () => {
                      dispatch(setIsLoader(true));
                      await deleteAdminInToSuperAdminReq(item);
                      await fetchAdminList();
                      dispatch(setIsLoader(false));
                    }}
                  >
                    <Text style={styles.btnTxt}>
                      {isRtl ? "ہٹائیں" : "Remove"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            );
          }}
        />
      ) : !selector?.isLoaderStart ? (
        <View style={styles.emptyCont}>
          <Text style={styles.emptyTxt}>No admin found!</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  ratingCont: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    height: hv(60),
  },
  btnCont: {
    backgroundColor: AppColors.green.dark,
    borderRadius: normalized(25 / 2),
    width: normalized(80),
    height: hv(25),
    justifyContent: "center",
    alignItems: "center",
  },
  btnTxt: {
    fontSize: normalized(12),
    fontFamily: AppFonts.OpenSansRegular,
    fontWeight: "400",
    color: AppColors.white.white,
  },
  emptyCont: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyTxt: {
    fontSize: normalized(16),
    fontWeight: "500",
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
});
export default AddAdminScreen;
