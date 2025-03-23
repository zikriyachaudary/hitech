import React from "react";
import { View, StyleSheet, Image, TextInput } from "react-native";
import {
  AppColors,
  AppImages,
  normalized,
} from "../../../../Utils/AppConstants";

interface Props {
  containerStyle?: any;
  onGetAddress?: any;
  onChangeTxt?: any;
  value?: any;
  placeHolder: any;
  placeHolderColor?: any;
  onPressLastIcon?: any;
}

const SearchInput = (props: Props) => {
  return (
    <View style={[styles.container, props.containerStyle]}>
      <TextInput
        style={styles.input}
        onChangeText={props.onChangeTxt}
        value={props.value}
        placeholder={props.placeHolder}
        placeholderTextColor={props.placeHolderColor}
      />

      <Image
        source={AppImages.Home.search}
        style={styles.imageStyle}
        resizeMode="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    justifyContent: "center",
    borderColor: AppColors.grey.greyLevel10,
    height: normalized(50),
    borderRadius: 4,
  },
  imageStyle: {
    tintColor: AppColors.grey.greyLevel10,
  },
  input: {
    width: "87%",
    height: normalized(48),
    fontSize: 14,
  },
});

export default SearchInput;
