import React, { useState } from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppColors,
  AppFonts,
  AppImages,
  normalized,
} from "../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../Redux/store/AppStore";

const CustomInput = React.forwardRef((props: any, ref: any) => {
  const [secureEntry, setSecureEntry] = useState(props?.secureEntry);
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );

  const isRtl = selector?.isRtl;

  return (
    <View>
      <View
        style={{
          ...styles.inputContainer,
          ...props.container,
          borderWidth: props?.isBorderBottom ? 0 : 1,
          borderColor: !props?.errorMsg
            ? AppColors.grey.greyLevel2
            : AppColors.red.dark,
          backgroundColor: !props?.errorMsg
            ? AppColors.white.white
            : AppColors.red.pink,
          flexDirection: isRtl ? "row-reverse" : "row",
        }}
      >
        {props?.leftIcon ? (
          <Pressable>
            <Image
              source={props.leftIcon}
              resizeMode="contain"
              style={{
                ...styles.leftIconStyle,
                marginStart: isRtl ? 0 : normalized(10),
                marginEnd: isRtl ? normalized(10) : 0,
              }}
            />
          </Pressable>
        ) : null}
        <TextInput
          ref={ref}
          editable={
            typeof props?.isEditable == "boolean" ? props?.isEditable : true
          }
          placeholderTextColor={
            props.placeHolderColor || AppColors.grey.greyLevel9
          }
          placeholder={props?.placeHold}
          style={{
            ...styles.txtInput,
            ...props.textInputStyle,
            textAlign: isRtl ? "right" : "left",
            color:
              typeof props?.isEditable == "boolean" && !props?.isEditable
                ? AppColors.grey.greyLevel9
                : AppColors.black.black,
            paddingLeft: isRtl ? normalized(5) : normalized(12),
            paddingRight: isRtl ? normalized(12) : normalized(5),
          }}
          secureTextEntry={secureEntry}
          onChangeText={(txt: any) => {
            if (props?.setValue && !props?.isDisable) {
              props?.setValue(txt);
            }
          }}
          keyboardType={props?.keyboardType ? props?.keyboardType : "default"}
          multiline={props?.isMultiLine ? props?.isMultiLine : false}
          value={props?.value}
          blurOnSubmit={props?.blurOnSubmit}
          returnKeyType={props?.returnKeyType}
          onSubmitEditing={props?.onSubmitEditing}
          scrollEnabled={props?.isScrollable}
          maxLength={props?.maxLength ? props?.maxLength : 250}
        />

        {props?.showLastIcon ? (
          <TouchableOpacity
            style={{ padding: normalized(10) }}
            onPress={() => {
              props?.secureEntry ? setSecureEntry(!secureEntry) : null;
            }}
          >
            <Image
              source={secureEntry ? AppImages.Auth.eye : props?.rightIcon}
              style={{
                width: normalized(24),
                height: normalized(24),
                tintColor: AppColors.themeColor.dark,
              }}
              resizeMode="contain"
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {props?.errorMsg?.length > 0 ? (
        <Text
          style={{
            ...styles.errorMsg,
            ...props.errorStyle,
            textAlign: isRtl ? "right" : "left",
          }}
        >
          {props?.errorMsg}
        </Text>
      ) : null}
    </View>
  );
});

const styles = StyleSheet.create({
  inputContainer: {
    height: normalized(45),
    width: "100%",
    alignSelf: "center",
    borderColor: AppColors.grey.greyLevel3,
    borderRadius: normalized(7),
    alignItems: "center",
  },
  txtInput: {
    includeFontPadding: false,
    flex: 1,
    fontFamily: AppFonts.PoppinsRegular,
    justifyContent: "center",
  },
  errorMsg: {
    marginTop: 3,
    color: "red",
    fontSize: normalized(12),
    marginLeft: normalized(2),
  },
  leftIconStyle: {
    height: normalized(22),
    width: normalized(22),
    tintColor: AppColors.themeColor.dark,
  },
});

export default CustomInput;
