import React from "react";
import {
  View,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Text,
} from "react-native";
import {
  AppColors,
  AppFonts,
  hv,
  normalized,
} from "../../../Utils/AppConstants";

const Bar = ({ obj, onPress, index, tab }: any) => {
  return (
    <TouchableWithoutFeedback key={obj.title} onPress={() => onPress()}>
      <View
        style={{
          justifyContent: "center",
          alignItems: "center",
          height: normalized(50),
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
            fontSize: normalized(12),
            fontFamily: AppFonts.PoppinsMedium,
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
    width: 20,
    height: 20,
  },
});
export default Bar;
