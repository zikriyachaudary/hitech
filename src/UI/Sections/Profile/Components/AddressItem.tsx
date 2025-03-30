import {
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
  ScreenProps,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import { duration } from "moment";

const AddressItem = (props: any) => {
  const item = props?.item;
  return (
    <TouchableOpacity
      style={{
        ...styles.mainCont,
        borderColor: item?.isDefault
          ? AppColors.themeColor.dark
          : "transparent",
        borderWidth: 1,
      }}
      onPress={() => {
        props?.changeDefaultAddress();
        LayoutAnimation.configureNext({
          ...LayoutAnimation.Presets.linear,
          duration: 200,
        });
      }}
      activeOpacity={0.7}
    >
      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.editIconCont}
        onPress={() => props?.onEdit(item)}
      >
        <Image source={AppImages.Products.editIcon} style={styles.editIcon} />
      </TouchableOpacity>
      {item?.isDefault ? (
        <View style={styles.topCont}>
          <Text style={styles.defaultTxt}>Default Address</Text>
        </View>
      ) : (
        <View style={{ height: normalized(25) }} />
      )}
      <View style={styles.cont}>
        <Image
          source={AppImages.Profile.locationUnfilled}
          style={styles.icon}
        />
        <Text style={styles.addressTxt}>Address</Text>
        <View style={styles.divider} />
        <Text style={styles.generalAddress}>{item?.address}</Text>
      </View>

      <View style={styles.cont}>
        <Image source={AppImages.bottomBar.home} style={styles.icon} />
        <Text style={styles.addressTxt}>House No. </Text>
        <View style={styles.divider} />
        <Text numberOfLines={2} style={styles.generalAddress}>
          {item?.house}
        </Text>
      </View>

      <View style={styles.cont}>
        <Image source={AppImages.Profile.street} style={styles.icon} />
        <Text style={styles.addressTxt}>Street No. </Text>
        <View style={styles.divider} />
        <Text style={styles.generalAddress}>{item?.street}</Text>
      </View>

      <View style={styles.cont}>
        <Image source={AppImages.Profile.area} style={styles.icon} />
        <Text style={styles.addressTxt}>Area </Text>
        <View style={styles.divider} />
        <Text style={styles.generalAddress}>{item?.area}</Text>
      </View>

      <View style={styles.cont}>
        <Image source={AppImages.Profile.city} style={styles.icon} />
        <Text style={styles.addressTxt}>City</Text>
        <View style={styles.divider} />
        <Text style={styles.generalAddress}>{item?.city}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default AddressItem;

const styles = StyleSheet.create({
  mainCont: {
    width: ScreenSize.width - normalized(30),
    // height: normalized(150),
    backgroundColor: AppColors.white.white,
    borderRadius: normalized(10),
    alignSelf: "center",
    shadowColor: AppColors.black.black,
    shadowOpacity: 0.3,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
    paddingHorizontal: normalized(10),
    paddingBottom: normalized(10),
    marginTop: normalized(20),
  },
  icon: {
    width: normalized(20),
    height: normalized(20),
    resizeMode: "contain",
    tintColor: AppColors.themeColor.dark,
  },
  cont: {
    flexDirection: "row",
    marginTop: normalized(10),
    alignItems: "center",
  },
  divider: {
    backgroundColor: AppColors.themeColor.dark,
    width: normalized(1.5),
    height: normalized(15),
    borderRadius: normalized(10),
    marginHorizontal: normalized(10),
  },
  addressTxt: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsSemiBold,
    color: AppColors.themeColor.dark,
    marginLeft: normalized(10),
    width: normalized(80),
  },
  generalAddress: {
    fontSize: normalized(13),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsRegular,
    width: normalized(190),
    textAlign: "justify",
  },
  topCont: {
    width: normalized(140),
    height: normalized(25),
    backgroundColor: AppColors.green.light,
    borderWidth: 1,
    borderRadius: normalized(10),
    borderColor: AppColors.green.dark,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginTop: normalized(10),
  },
  defaultTxt: {
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.green.dark,
  },
  editIcon: {
    width: normalized(12),
    height: normalized(12),
    resizeMode: "contain",
  },
  editIconCont: {
    width: normalized(26),
    height: normalized(26),
    backgroundColor: AppColors.themeColor.dark,
    borderRadius: normalized(30),
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    top: normalized(5),
    right: normalized(5),
  },
});
