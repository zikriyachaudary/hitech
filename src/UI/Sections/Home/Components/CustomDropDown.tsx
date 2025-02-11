import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  LayoutAnimation,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppColors,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
const CustomDropDown = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (value: any) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (props?.atSelect) {
      props?.atSelect(value);
    }
    setIsOpen(false);
  };

  const rotationAnim = useRef(new Animated.Value(isOpen ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(rotationAnim, {
      toValue: isOpen ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [isOpen]);

  const rotateInterpolate = rotationAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["180deg", "360deg"],
  });

  return (
    <View style={[{ flex: 1 }, props?.dropDownStyle]}>
      <TouchableOpacity
        activeOpacity={1}
        style={{
          ...styles.mainContainer,
          borderColor: !props?.isError
            ? AppColors.grey.greyLevel2
            : AppColors.red.dark,
          backgroundColor: !props?.isError
            ? AppColors.white.white
            : AppColors.red.pink,
        }}
        disabled={props?.isDisable}
        onPress={() => {
          if (props?.isDisable) {
          } else {
            LayoutAnimation.configureNext(
              LayoutAnimation.Presets.easeInEaseOut
            );
            setIsOpen(!isOpen);
          }
        }}
      >
        <>
          <View style={{ flex: 1 }}>
            <Text
              style={
                props?.isDisable
                  ? {
                      color: AppColors.black.black,
                      fontSize: normalized(14),
                      fontWeight: "400",
                    }
                  : props?.selected?.length > 0
                  ? styles.selectedTxt
                  : styles.unSelectedTxt
              }
            >
              {props?.selected
                ? props?.selected?.cardName
                  ? props?.selected?.cardName
                  : props?.selected?.fullName
                  ? props?.selected?.fullName
                  : props?.selected
                : props?.placeHolder}
            </Text>
          </View>
          <View style={{ padding: normalized(5) }}>
            <Image
              source={AppImages.Auth.dropdown}
              style={{
                tintColor: AppColors.black.black,
                resizeMode: "contain",
                height: 20,
                width: 20,
                transform: [
                  {
                    rotateZ: isOpen ? `${360}deg` : `${180}deg`,
                  },
                ],
              }}
            />
          </View>
        </>
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.dropdownList, props?.listStyle]}>
          {props?.list.map((option: any, index: number) => {
            if (props?.nestedArr) {
              return (
                <>
                  {option?.title && option?.data?.length > 0 ? (
                    <View
                      key={index}
                      style={[
                        styles.dropdownOption,
                        { backgroundColor: AppColors.themeColor.dark },
                      ]}
                    >
                      <Text
                        style={{
                          ...styles.options,
                          color: AppColors.white.white,
                        }}
                      >
                        {option?.title}
                      </Text>
                    </View>
                  ) : null}
                  {option?.data.map((el: any, i: any) => {
                    let value =
                      props?.optionKey && el[props?.optionKey]?.length > 0
                        ? el[props?.optionKey]
                        : el?.cardName?.length > 0
                        ? el?.cardName
                        : el?.fullName?.length > 0
                        ? el?.fullName
                        : el?.name?.length > 0
                        ? el?.name
                        : el?.first_name?.length > 0
                        ? el?.first_name + " " + el?.last_name
                        : el instanceof Object
                        ? null
                        : el;

                    let isSelected = props?.selected?.id
                      ? el?.id == props?.selected?.id
                      : value == props?.selected;

                    return (
                      <TouchableOpacity
                        activeOpacity={1}
                        key={i}
                        style={[
                          styles.dropdownOption,
                          {
                            backgroundColor: isSelected
                              ? AppColors.themeColor.light
                              : AppColors.white.white,
                          },
                        ]}
                        onPress={() => {
                          handleOptionSelect(el);
                        }}
                      >
                        <Text style={styles.options}>{value}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </>
              );
            } else {
              let value =
                props?.optionKey && option[props?.optionKey]?.length > 0
                  ? option[props?.optionKey]
                  : option?.fullName?.length > 0
                  ? option?.fullName
                  : option?.name?.length > 0
                  ? option?.name
                  : option?.first_name?.length > 0
                  ? option?.first_name + " " + option?.last_name
                  : option instanceof Object
                  ? null
                  : option;

              return (
                <TouchableOpacity
                  activeOpacity={1}
                  key={index}
                  style={[
                    styles.dropdownOption,
                    value == props?.selected
                      ? { backgroundColor: AppColors.themeColor.light }
                      : null,
                  ]}
                  onPress={() => {
                    handleOptionSelect(option);
                  }}
                >
                  <Text style={styles.options}>{value}</Text>
                </TouchableOpacity>
              );
            }
          })}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: normalized(1),
    paddingHorizontal: normalized(15),
    borderColor: AppColors.grey.greyLevel2,
    borderRadius: normalized(10),
    height: normalized(50),
  },

  dropdownList: {
    width: "100%",
    borderColor: "black",
    backgroundColor: AppColors.white.white,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,

    elevation: 8,
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
  },
  dropdownOption: {
    height: 40,
    justifyContent: "center",
    borderBottomWidth: 1,
    borderColor: "#E2E3E4",
  },
  options: {
    fontSize: 14,
    marginLeft: hv(20),
    color: "#767D90",
  },
  selectedTxt: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.black.black,
  },
  unSelectedTxt: {
    fontSize: normalized(14),
    fontWeight: "400",
    color: AppColors.grey.greyLevel4,
  },
});
export default CustomDropDown;
