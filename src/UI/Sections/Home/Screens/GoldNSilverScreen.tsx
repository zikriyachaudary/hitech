import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import GoldNSilverTopTapNav from "./GoldNSilverTopTapNav";
import {
  getAllUsersReq,
  getOrdersByUserId,
} from "../../../../Network/Services/UserServices";
import { USER_TYPE } from "../../../../Utils/AppStrings";
import { setIsLoader } from "../../../../Redux/Reducers/AppReducers";
import { useIsFocused } from "@react-navigation/native";

const GoldNSilverScreen = (props: ScreenProps) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  const [goldUsers, setGoldUsers] = useState<any>([]);
  const [silverUsers, setSilverUsers] = useState<any>([]);
  const dispatch = useDispatch();
  const isFocused = useIsFocused();

  const fetchUsers = async () => {
    dispatch(setIsLoader(true));
    await getAllUsersReq(async (res: any) => {
      if (res?.status) {
        const usersWithOrders = await Promise.all(
          res.data.map(async (user: any) => {
            const orders = await new Promise((resolve) => {
              getOrdersByUserId(user.userId, (orderRes: any) => {
                resolve(orderRes.data);
              });
            });
            return { ...user, orders };
          })
        );
        const gold = usersWithOrders.filter(
          (user) => user?.userType == USER_TYPE.Gold
        );
        const silver = usersWithOrders.filter(
          (user) => user.userType === USER_TYPE.Silver
        );
        setGoldUsers(gold);
        setSilverUsers(silver);
        dispatch(setIsLoader(false));
      } else {
        dispatch(setIsLoader(false));
      }
    });
  };

  useEffect(() => {
    fetchUsers();
  }, [isFocused]);
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <View
        style={{
          ...styles.headerCont,
          flexDirection: isRtl ? "row-reverse" : "row",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            props?.navigation?.goBack();
          }}
          activeOpacity={0.7}
        >
          <Image
            style={[
              styles.arrowImage,
              { transform: [{ scaleX: isRtl ? -1 : 1 }] },
            ]}
            source={AppImages.Auth.backArrow}
            tintColor={AppColors.themeColor.dark}
          />
        </TouchableOpacity>
        <Text style={styles.forgetText}>
          {isRtl ? "گولڈ اور سلور کسٹمرز" : "Gold And Silver Customers"}
        </Text>
        <View style={{ width: normalized(25) }} />
      </View>

      <GoldNSilverTopTapNav goldUsers={goldUsers} silverUsers={silverUsers} />
    </View>
  );
};

export default GoldNSilverScreen;

const styles = StyleSheet.create({
  arrowImage: {
    width: normalized(45),
    height: normalized(45),
    resizeMode: "contain",
  },
  forgetText: {
    fontFamily: AppFonts.PoppinsMedium,
    fontSize: normalized(16),
    color: AppColors.black.black,
    marginLeft: normalized(10),
    fontWeight: "600",
  },
  headerCont: {
    marginTop: 10,
    height: normalized(50),
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: normalized(15),
    borderWidth: 1,
    borderBottomColor: "transparent",
    borderTopColor: "transparent",
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderRadius: normalized(50),
    shadowColor: AppColors.black.black,
    shadowOffset: {
      height: 2,
      width: 0,
    },
    elevation: 5,
    shadowOpacity: 0.3,
    shadowRadius: normalized(3),
    backgroundColor: AppColors.white.white,
    paddingHorizontal: normalized(3),
  },
});
