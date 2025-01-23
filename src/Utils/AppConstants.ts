import { Dimensions, PixelRatio } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { useSelector } from "react-redux";
import { AppRootStore } from "../Redux/store/AppStore";

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
  red: {
    dark: "#FF2B15",
    pink: "#fbe3e3",
  },
  themeColor: {
    dark: "#C85D06",
    light: "#FEB851",
    medium: "#fab57d",
  },
  orange: {
    light: "#FDF1DB",
    dark: "#FE9311",
  },
  green: {
    dark: "#00BE13",
    light: "#cbf5dd",
  },
  randomColor: {
    purpleDark: "rgba(43, 42, 105, 1)",
    purple: "#6E397D",
    black: "#000000",
    blue: "rgba(15, 69, 144, 1)",
    navy: "#135099",
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
  logo: require("../UI/assets/Images/logo.png"),
  Auth: {
    eye: require("../UI/assets/Images/Auth/Eye.png"),
    hideEye: require("../UI/assets/Images/Auth/hideEye.png"),
    message: require("../UI/assets/Images/Auth/Message.png"),
    google: require("../UI/assets/Images/Auth/Google.png"),
    dropdown: require("../UI/assets/Images/Auth/dropdown.png"),
    backArrow: require("../UI/assets/Images/Auth/BackArrow.png"),
    camera: require("../UI/assets/Images/Auth/camera.png"),
    apple: require("../UI/assets/Images/Auth/apple.png"),
    pin: require("../UI/assets/Images/Auth/pin.png"),
  },
  Modal: {
    Camera: require("../UI/assets/Images/Home/CameraPicker.png"),
    Gallery: require("../UI/assets/Images/Home/GalleryPicker.png"),
  },
  Home: {
    tick: require("../UI/assets/Images/Profile/tick.png"),
    filter: require("../UI/assets/Images/Home/filter.png"),
    close: require("../UI/assets/Images/Home/CloseIcon.png"),
    cart: require("../UI/assets/Images/Home/cart.png"),
    star: require("../UI/assets/Images/Home/star.png"),
  },
  Products: {
    editIcon: require("../UI/assets/Images/products/editIcon.png"),
    delete: require("../UI/assets/Images/products/Delete.png"),
    emptyCart: require("../UI/assets/Images/products/emptyCart.png"),
  },
  bottomBar: {
    home: require("../UI/assets/Images/BottomBar/Home.png"),
    profile: require("../UI/assets/Images/BottomBar/profile.png"),
    notification: require("../UI/assets/Images/BottomBar/notification.png"),
    orders: require("../UI/assets/Images/BottomBar/orders.png"),
  },
  Profile: {
    ForwardArrow: require("../UI/assets/Images/Profile/forwardArrow.png"),
    ProfileIcon: require("../UI/assets/Images/Profile/profileIcon.png"),
    LocationIcon: require("../UI/assets/Images/Profile/location.png"),
    privacyIcon: require("../UI/assets/Images/Profile/privacyIcon.png"),
    SettingIcon: require("../UI/assets/Images/Profile/settingIcon.png"),
    LogoutIcon: require("../UI/assets/Images/Profile/logoutIcon.png"),
    deleteUser: require("../UI/assets/Images/Profile/deleteUser.png"),
  },
};

export const imagePickerConstants = [
  {
    id: 0,
    image: AppImages.Modal.Gallery,
    text: "Upload from Gallery",
  },
  {
    id: 1,
    image: AppImages.Modal.Camera,
    text: "Take a photo from Camera",
  },
];

export const profileBarList = [
  {
    id: 1,
    text: "Edit Your Profile",
    leftIcon: AppImages.Profile.ProfileIcon,
  },
  // {
  //   id: 6,
  //   text: 'Privacy & Policy',
  //   leftIcon: AppImages.Profile.privacyIcon,
  // },
  {
    id: 7,
    text: "Settings",
    leftIcon: AppImages.Profile.SettingIcon,
  },
  {
    id: 8,
    text: "Delete Account",
    leftIcon: AppImages.Profile.deleteUser,
  },
  {
    id: 9,
    text: "Log out",
    leftIcon: AppImages.Profile.LogoutIcon,
  },
];

export const dummyProfile =
  "https://firebasestorage.googleapis.com:443/v0/b/zippy-6ae4c.appspot.com/o/KPXaHR9D96ED07-63BE-4F4D-846B-7895376E50C3.jpg?alt=media&token=32340295-3a0d-41a7-abc5-9a744cdf9802";
