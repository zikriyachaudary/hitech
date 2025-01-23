import { useDispatch, useSelector } from "react-redux";
import React from "react";
import { View } from "react-native";
import Bar from "./Bar";
import { AppColors, normalized } from "../../../Utils/AppConstants";
import { setTab } from "../../../Redux/Reducers/AppReducers";
import { AppRootStore } from "../../../Redux/store/AppStore";

const BottomBar = ({ bottomBarList, navigation, tab }: any) => {
  const dispatch = useDispatch();
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );

  return (
    <View
      style={{
        justifyContent: "center",
        height: normalized(65),
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,
        elevation: 15,
        borderTopLeftRadius: normalized(25),
        borderTopRightRadius: normalized(25),
        bottom: selector?.hasSoftNavigationBar ? normalized(24) : 0,
      }}
    >
      <View
        style={{
          width: "100%",
          height: normalized(100),
          flexDirection: "row",
          justifyContent: "space-around",
          backgroundColor: AppColors.white.white,
          paddingHorizontal: normalized(25),
          borderTopLeftRadius: normalized(25),
          borderTopRightRadius: normalized(25),
          zIndex: 20,
          paddingTop: normalized(10),
          borderColor: AppColors.themeColor.dark,
          borderWidth: 1,
        }}
      >
        {bottomBarList.map((item: any, index: any) => (
          <View key={index} style={{}}>
            <Bar
              key={item.title}
              tab={tab}
              obj={item}
              index={index}
              onPress={() => {
                if (navigation.canGoBack()) {
                  navigation.popToTop();
                }
                dispatch(setTab(index));
              }}
            />
          </View>
        ))}
      </View>
    </View>
  );
};
export default BottomBar;
