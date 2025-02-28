import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { useSelector } from "react-redux";
import UserItem from "../Components/UserItem";
import { ScreenProps } from "../../../../Utils/AppConstants";
import { Routes } from "../../../../Utils/Routes";
import { useNavigation } from "@react-navigation/native";

const SilverScreen = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const navigation: any = useNavigation();
  const [silverUsers, setSilverUsers] = useState<any>(props?.silverUsers);

  return (
    <View style={AppStyles.MainStyle}>
      <FlatList
        data={props?.silverUsers}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <UserItem
            item={item}
            onPress={() =>
              navigation?.navigate(Routes.Admin.UserOrderDetail, {
                item: item,
              })
            }
          />
        )}
        keyExtractor={(item) => item?.id}
      />
    </View>
  );
};

export default SilverScreen;

const styles = StyleSheet.create({});
