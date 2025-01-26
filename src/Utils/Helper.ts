import { AppColors } from "./AppConstants";

export const generateRandomColor = (index: any) => {
  const colorIndex = index % 5;
  const allColors = [
    AppColors.randomColor.black,
    AppColors.randomColor.purpleDark,
    AppColors.randomColor.purple,
    AppColors.randomColor.blue,
    AppColors.randomColor.navy,
  ];
  return allColors[colorIndex];
};

export const capitalizeFirstLetter = (txt = "") => {
  if (txt?.length > 0) {
    const arr = txt.split(" ");
    return arr.length == 0
      ? "-"
      : arr.length == 1
      ? txt.charAt(0).toUpperCase()
      : arr[0].charAt(0).toUpperCase() + arr[1].charAt(0).toUpperCase();
  } else {
    return "";
  }
};

export const formatPhoneNumber = (phoneNumber: any) => {
  if (phoneNumber.startsWith("0")) {
    return phoneNumber.replace(/^0/, "+92");
  } else {
    return "+92" + phoneNumber;
  }
};
