import React, { useState } from "react";
import {
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
} from "../../../Utils/AppConstants";
const CustomDropDownList = (props: any) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionSelect = (value: any) => {
    if (props?.atSelect) {
      props?.atSelect(value);
    }
    setIsOpen(false);
  };

  return (
    <View
      style={[
        props?.dropDownStyle,
        {
          // flex: 1,
          height: isOpen ? normalized(150) : normalized(50),
          alignSelf: "center",
        },
      ]}
    >
      <TouchableOpacity
        activeOpacity={1}
        style={{
          ...styles.mainContainer,
          ...{
            backgroundColor: props?.isError
              ? AppColors.red.pink
              : AppColors.white.white,
            borderColor: props?.isError
              ? AppColors.red.dark
              : AppColors.grey.greyLevel9,
          },
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
              {props?.selected || props?.placeHolder}
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
                    rotateZ: isOpen ? `${180}deg` : `${270}deg`,
                  },
                ],
              }}
            />
          </View>
        </>
      </TouchableOpacity>
      {isOpen && (
        <View style={[styles.dropdownList, props?.listStyle]}>
          {props?.list?.map((option: any, index: number) => {
            let value = props?.withPercent
              ? `${option.discountInPer}% Discount`
              : option;

            return (
              <TouchableOpacity
                activeOpacity={1}
                key={index}
                style={[
                  styles.dropdownOption,

                  {
                    backgroundColor:
                      value == props?.selected
                        ? AppColors.themeColor.dark
                        : AppColors.white.white,
                  },
                ]}
                onPress={() => {
                  handleOptionSelect(option);
                }}
              >
                <Text
                  style={{
                    ...styles.options,
                    color:
                      value == props?.selected
                        ? AppColors.white.white
                        : AppColors.black.black,
                  }}
                >
                  {value}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
    </View>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: normalized(1),
    paddingHorizontal: normalized(15),
    borderColor: AppColors.grey.greyLevel9,
    borderRadius: normalized(10),
    height: normalized(45),
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
    color: AppColors.grey.greyLevel9,
  },
});
export default CustomDropDownList;
