import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import { ScreenProps } from "../../../../Utils/AppConstants";

const NewPasswordScreen = (props: ScreenProps) => {
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        Text={"Set New Password"}
        onPress={() => props?.navigation?.goBack()}
      />
      <Text>NewPasswordScreen</Text>
    </View>
  );
};

export default NewPasswordScreen;

const styles = StyleSheet.create({});
