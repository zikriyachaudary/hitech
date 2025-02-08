import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { ScreenProps } from "../../../../Utils/AppConstants";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import CustomInput from "../../../Components/CustomInput/CustomInput";

const AddCategoryScreen = (props: ScreenProps) => {
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        Text={"Add Category"}
        onPress={() => props?.navigation?.goBack()}
      />
      <Text>Category Name</Text>
      <CustomInput value />
      <FilledButton label={"Publish"} onPress={() => {}} />
    </View>
  );
};

export default AddCategoryScreen;

const styles = StyleSheet.create({});
