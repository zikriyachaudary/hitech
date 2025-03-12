import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import UserItem from "../Components/UserItem";
import {
  AppColors,
  hv,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import { Routes } from "../../../../Utils/Routes";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";

const SilverScreen = (props: any) => {
  const navigation: any = useNavigation();
  const [silverUsers, setSilverUsers] = useState<any>(props?.silverUsers);
  const selector = useSelector((state: any) => state.SliceReducer);

  return (
    <View style={AppStyles.MainStyle}>
      <FlatList
        data={props?.silverUsers}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <>
            <UserItem
              item={item}
              onPress={() =>
                navigation?.navigate(Routes.Admin.UserOrderDetail, {
                  item: item,
                })
              }
            />
            {index !== silverUsers?.length - 1 && (
              <View style={styles.horiDivider} />
            )}
          </>
        )}
        ListEmptyComponent={() => {
          return (
            !selector?.isLoaderStart && (
              <View style={styles.emptyListCont}>
                <Text style={styles.emptyList}>{"No User Found!"}</Text>
              </View>
            )
          );
        }}
      />
    </View>
  );
};

export default SilverScreen;

const styles = StyleSheet.create({
  horiDivider: {
    height: normalized(1),
    width: ScreenSize.width - normalized(160),
    backgroundColor: AppColors.grey.greyLevel3,
    alignSelf: "center",
    marginVertical: normalized(5),
  },
  emptyList: {
    fontSize: normalized(15),
    fontWeight: "400",
    color: AppColors.black.black,
    lineHeight: hv(25),
    textAlign: "center",
  },
  emptyListCont: {
    height: ScreenSize.height - 300,
    justifyContent: "center",
    alignItems: "center",
  },
});
