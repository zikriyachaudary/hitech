import React from "react";
import { Modal, StyleSheet, Text, View } from "react-native";
import { AppColors, hv, normalized } from "../../../Utils/AppConstants";
import FilledButton from "../CustomButton/FilledButton";
import AppStatusBar from "../SocialButton/AppStatusBar";
import { AppStrings } from "../../../Utils/AppStrings";
interface Props {
  message: any;
  onPress: any;
  visible: any;
  indigo?: any;
}
export default function AlertModal(props: Props) {
  return (
    <Modal animationType="fade" visible={props?.visible} transparent={true}>
      <AppStatusBar
        backgroundColor={
          props.indigo ? "rgba(13, 13, 46,0.92)" : "rgba(0,0,0,0.3)"
        }
        barStyle={"light-content"}
      />

      <View style={styles.container}>
        <View style={styles.alertBox}>
          <Text style={styles.title}>Alert</Text>
          <Text style={styles.label}>
            {props.message || AppStrings.Network.someThingError}
          </Text>
          <FilledButton
            mainContainer={{
              width: normalized(120),
              height: normalized(35),
              marginVertical: 0,
            }}
            label="Ok"
            onPress={() => props?.onPress()}
          />
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    marginHorizontal: normalized(20),
    backgroundColor: AppColors.white.white,
    borderRadius: 11,
    alignItems: "center",
    justifyContent: "center",
    padding: normalized(15),
  },
  label: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    marginVertical: hv(15),
    textAlign: "center",
  },
  title: {
    fontSize: normalized(18),
    color: AppColors.red.dark,
  },
});
