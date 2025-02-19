import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useSelector } from "react-redux";
import {
  AppColors,
  AppFonts,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
import { AppRootStore } from "../../../../Redux/store/AppStore";

const ProfileBar = ({ List, setValue }: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  return (
    <View style={{ marginVertical: hv(10), marginHorizontal: normalized(20) }}>
      {List.map((item: any, index: number) => (
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => setValue(item?.id)}
          key={index}
          style={{
            backgroundColor: AppColors.grey.greyLevel0,
            height: normalized(45),
            paddingHorizontal: normalized(20),
            borderRadius: normalized(5),
            marginTop: normalized(10),
            flexDirection: isRtl ? "row-reverse" : "row",
            alignItems: "center",
          }}
        >
          <Image
            source={item.leftIcon}
            style={{
              height: normalized(23),
              width: normalized(23),
              resizeMode: "contain",
            }}
          />
          <Text
            style={[
              styles.barTxt,
              {
                marginLeft: isRtl ? 0 : normalized(25),
                marginRight: isRtl ? normalized(25) : 0,
              },
            ]}
          >
            {isRtl ? item?.rtlTxt : item.text}
          </Text>

          <View
            style={{
              flex: 1,
              alignItems: isRtl ? "flex-start" : "flex-end",
            }}
          >
            <Image
              source={AppImages.Profile.ForwardArrow}
              style={{
                height: normalized(16),
                width: normalized(26),
                resizeMode: "contain",
                transform: [{ scaleX: isRtl ? -1 : 1 }],
              }}
            />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  barTxt: {
    fontFamily: AppFonts.PoppinsMedium,
    fontSize: normalized(14),
    color: "#343A40",
    fontWeight: "500",
  },
});
export default ProfileBar;
