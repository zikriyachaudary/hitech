import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { AppStyles } from "../../../../Utils/AppStyles";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import { useSelector } from "react-redux";
import UserItem from "../Components/UserItem";

const SilverScreen = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const [silverUsers, setSilverUsers] = useState<any>(props?.silverUsers);

  return (
    <View style={AppStyles.MainStyle}>
      <FlatList
        data={props?.silverUsers}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <UserItem item={item} />}
        keyExtractor={(item) => item?.id}
      />
    </View>
  );
};

export default SilverScreen;

const styles = StyleSheet.create({});
