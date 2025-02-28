import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import UserItem from "../Components/UserItem";
import { useNavigation } from "@react-navigation/native";
import { Routes } from "../../../../Utils/Routes";
import {
  AppColors,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";

const GoldScreen = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const [goldUsers, setGoldUsers] = useState<any>(props?.goldUsers || []);
  const navigation: any = useNavigation();

  return (
    <View style={AppStyles.MainStyle}>
      <FlatList
        data={props?.goldUsers}
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
            {index !== goldUsers?.length - 1 && (
              <View style={styles.horiDivider} />
            )}
          </>
        )}
        keyExtractor={(item) => item?.id}
      />
    </View>
  );
};

export default GoldScreen;

const styles = StyleSheet.create({
  horiDivider: {
    height: normalized(1),
    width: ScreenSize.width - normalized(160),
    backgroundColor: AppColors.grey.greyLevel3,
    alignSelf: "center",
    marginVertical: normalized(5),
  },
});
