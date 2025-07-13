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
  if (phoneNumber.startsWith("+92")) {
    return phoneNumber;
  } else if (phoneNumber.startsWith("0")) {
    return phoneNumber.replace(/^0/, "+92");
  } else {
    return "+92" + phoneNumber;
  }
};

export const validateInput = (value: any) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const phoneRegex = /^03[0-9]{9}$/; // Pakistani format
  const usernameRegex = /^[a-zA-Z0-9_]{6,25}$/; // 6-25 chars

  if (emailRegex.test(value)) {
    return { type: "email", isValid: true };
  } else if (phoneRegex.test(value)) {
    return { type: "phone", isValid: true };
  } else if (usernameRegex.test(value)) {
    return { type: "username", isValid: true };
  } else {
    return { type: "invalid", isValid: false };
  }
};

/**
 * Luhn algorithm in JavaScript: validate credit card number supplied as string of numbers
 * @author ShirtlessKirk. Copyright (c) 2012.
 * @license WTFPL (http://www.wtfpl.net/txt/copying)
 */
export const luhnChk = (function (arr) {
  return function (ccNum: string): boolean {
    // Added type annotation for ccNum and return type
    var len = ccNum.length,
      bit = 1,
      sum = 0,
      val;

    while (len) {
      val = parseInt(ccNum.charAt(--len), 10);
      // Added a check for NaN in case ccNum contains non-numeric characters
      if (isNaN(val)) {
        return false; // Or handle error appropriately
      }
      sum += (bit ^= 1) ? arr[val] : val;
    }

    return sum !== 0 && sum % 10 === 0;
  };
})([0, 2, 4, 6, 8, 1, 3, 5, 7, 9]);

export const validateExpiryDate = (expiry: string) => {
  if (!/^\d{2}\/\d{2}$/.test(expiry)) return false;

  const [monthStr, yearStr] = expiry.split("/");
  const month = parseInt(monthStr, 10);
  const year = parseInt("20" + yearStr, 10); // Converts '25' -> 2025

  if (isNaN(month) || isNaN(year)) return false;
  if (month < 1 || month > 12) return false;

  const now = new Date();
  const expiryDate = new Date(year, month); // set to first day of next month

  return expiryDate > now;
};
