import { Dimensions, PixelRatio } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";

export const ScreenSize = Dimensions.get("screen");
const templateWidth = 375;
const templateHeight = 812;
export const isLargeWidth = Dimensions.get("window").width > 390;

export type ScreenProps = NativeStackScreenProps<any, any>;
export const fullDate = "Y-MM-DD HH:mm:ss.SSS Z";

export const maxImageSizeInBytes = 10 * 1024 * 1024; // 10MB

const widthRatio = ScreenSize.width / templateWidth;
const heightRatio = ScreenSize.height / templateHeight;
export const normalized = (value: number) =>
  PixelRatio.roundToNearestPixel(value * widthRatio);
export const hv = (value: number) =>
  PixelRatio.roundToNearestPixel(value * heightRatio);

export const AppHorizontalMargin = normalized(20);
export const bottomBarHeight = normalized(60);
export const isSmallDevice = ScreenSize.height < 700 ? true : false;

export const AppColors = {
  dark: {
    darkLevel1: "#535F79",
    darkLevel2: "#4B576E",
    darkLevel3: "#333E56",
    darkLevel4: "#232C3D",
    darkLevel5: "#21293B",
    darkLevel6: "#19202E",
    darkLevel7: "#10151B",
    darkLevel8: "#020101",
    darkLevel9: "#252525",
  },
  black: {
    black: "#000000",
    lightBlack: "#252525",
    black4: "#343A40",
    Level5: "#272727",
    Level6: "#202224",
    Level7: "#191D23",
    Level8: "#090b0e",
    Level9: "#101010",
  },
  white: {
    white: "#ffffff",
    whiteOp: "#E8E8E8",
    lightWhite: "#EEEEEE",
    creamy: "#ffe3e3",
    simple: "#f2f6fc",
    darkGrey: "#EDEDED",
  },
  grey: {
    greyLevel0: "#eeeeee",
    greyLevel1: "#E4E7EB",
    greyLevel2: "#C2C2C2",
    greyLevel3: "#D0D5DD",
    greyLevel4: "#8c8e91",
    greyLevel5: "#606060",
    greyLevel6: "#6B7280",
    greyLevel7: "#616161",
    greyLevel8: "#75777b",
    greyLevel9: "#909090",
    greyLevel10: "#F9F9F9",
    light: "#F7F6F4",
  },
};

export const AppFonts = {
  PoppinsBlack: "Poppins-Black",
  PoppinsRegular: "Poppins-Regular",
  PoppinsSemiBold: "Poppins-SemiBold",
  PoppinsBold: "Poppins-Bold",
  PoppinsExtraBold: "Poppins-ExtraBold",
  PoppinsLight: "Poppins-Light",
  PoppinsExtraLight: "Poppins-ExtraLight",
  PoppinsItalic: "Poppins-Italic",
  PoppinsMedium: "Poppins-Medium",
  PoppinsThin: "Poppins-Thin",
  PoppinsBoldItalic: "Poppins-ExtraBoldItalic",
  PoppinsBlackItalic: "Poppins-BlackItalic",
  OpenSansRegular: "OpenSans-Regular",
  OpenSansSemiBold: "OpenSans-SemiBold",
  OpenSansBold: "OpenSans-Bold",
  OpenSansExtraBold: "OpenSans-ExtraBold",
  OpenSansLight: "OpenSans-Light",
  OpenSansExtraLight: "OpenSans-ExtraLight",
  OpenSansItalic: "OpenSans-Italic",
  OpenSansMedium: "OpenSans-Medium",
  OpenSansBoldItalic: "OpenSans-ExtraBoldItalic",
};

export const AppImages = {
  logo: require("../Ui/assets/images/logo.png"),
  Auth: {
    eye: require("../Ui/assets/images/Auth/Eye.png"),
    hideEye: require("../Ui/assets/images/Auth/hideEye.png"),
    message: require("../Ui/assets/images/Auth/Message.png"),
    google: require("../Ui/assets/images/Auth/Google.png"),
    dropdown: require("../Ui/assets/images/Auth/dropdown.png"),
    backArrow: require("../Ui/assets/images/Auth/BackArrow.png"),
    camera: require("../Ui/assets/images/Auth/camera.png"),
    apple: require("../Ui/assets/images/Auth/apple.png"),
    pin: require("../Ui/assets/images/Auth/pin.png"),
  },
};
