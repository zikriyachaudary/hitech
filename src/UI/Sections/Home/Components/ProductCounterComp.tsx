import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AppColors, hv, normalized } from "../../../../Utils/AppConstants";

const ProductCounterComp = (props: any) => {
  return (
    <View style={styles.mainCont}>
      <TouchableOpacity
        activeOpacity={1}
        style={styles.childCont}
        onPress={() => {
          if (props?.count > 1) {
            props?.atDecreaseCount();
          }
        }}
      >
        <Text style={styles.innerTxt}>-</Text>
      </TouchableOpacity>
      <View style={styles.countTxtCont}>
        <Text style={styles.countTxt}>{props?.count}</Text>
      </View>

      <TouchableOpacity
        activeOpacity={1}
        style={styles.childCont}
        onPress={() => {
          if (props?.count < 30) {
            props?.atIncreaseCount();
          }
        }}
      >
        <Text style={styles.innerTxt}>+</Text>
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  mainCont: {
    flexDirection: "row",
    borderColor: AppColors.grey.greyLevel3,

    borderRadius: normalized(20),
    height: hv(40),
    width: normalized(130),
    justifyContent: "space-around",
    alignItems: "center",
  },
  childCont: {
    width: normalized(35),
    height: hv(35),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalized(35 / 2),
    borderWidth: 1,
    borderColor: AppColors.primaryRed,
  },
  innerTxt: {
    fontSize: normalized(22),
    fontWeight: "400",
    color: AppColors.primaryRed,
  },
  countTxt: {
    fontSize: normalized(16),
    fontWeight: "400",
    color: AppColors.black.black,
  },
  countTxtCont: {
    backgroundColor: AppColors.grey.light,
    borderRadius: normalized(10),
    width: normalized(30),
    height: hv(30),
    justifyContent: "center",
    alignItems: "center",
  },
});
export default ProductCounterComp;
