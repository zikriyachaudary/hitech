import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
  Platform,
} from "react-native";
import {
  AppColors,
  AppFonts,
  hv,
  normalized,
} from "../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../Redux/store/AppStore";

const Bar = ({ obj, onPress, index, tab }: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  return (
    <TouchableWithoutFeedback key={obj.title} onPress={() => onPress()}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: Platform.OS == "ios" ? normalized(40) : normalized(50),
        }}
      >
        <Image
          style={[
            styles.selectedTab,
            {
              tintColor:
                tab == index
                  ? AppColors.themeColor.dark
                  : AppColors.grey.greyLevel9,
            },
          ]}
          source={obj.icon}
          resizeMode="contain"
        />
        <Text
          style={{
            color:
              tab == index
                ? AppColors.themeColor.dark
                : AppColors.grey.greyLevel9,
            fontSize: isRtl ? normalized(14) : normalized(12),
            fontFamily: isRtl
              ? AppFonts.PoppinsSemiBold
              : AppFonts.PoppinsMedium,
            marginTop: isRtl ? normalized(5) : 0,
          }}
        >
          {obj?.title}
        </Text>
      </View>
    </TouchableWithoutFeedback>
  );
};
const styles = StyleSheet.create({
  selectedTab: {
    tintColor: AppColors.grey.greyLevel9,
    width: normalized(22),
    height: normalized(22),
    paddingVertical: normalized(5),
  },
});
export default Bar;
