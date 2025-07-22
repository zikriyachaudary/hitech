import moment from "moment";
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

export const groupOrdersByDate = (orders = [], isRtl = false) => {
  const grouped: Record<string, any[]> = {};

  orders.forEach((order: any) => {
    const rawDate = order?.createdAt;
    if (!rawDate) return;

    // ✅ Convert Firestore Timestamp to JS Date
    const orderDate = moment(rawDate?.toDate ? rawDate.toDate() : rawDate);

    if (!orderDate.isValid()) {
      console.warn("Invalid date:", rawDate);
      return;
    }

    let label = orderDate.format("DD-MMM-YYYY");

    if (orderDate.isSame(moment(), "day")) {
      label = isRtl ? "آج" : "Today";
    } else if (orderDate.isSame(moment().subtract(1, "day"), "day")) {
      label = isRtl ? "کل" : "Yesterday";
    }

    if (!grouped[label]) grouped[label] = [];
    grouped[label].push(order);
  });

  const sortedSections = Object.entries(grouped)
    .sort((a, b) => {
      const dateA =
        a[0] === "Today" || a[0] === "آج"
          ? moment()
          : a[0] === "Yesterday" || a[0] === "کل"
          ? moment().subtract(1, "day")
          : moment(a[0], "DD-MMM-YYYY");

      const dateB =
        b[0] === "Today" || b[0] === "آج"
          ? moment()
          : b[0] === "Yesterday" || b[0] === "کل"
          ? moment().subtract(1, "day")
          : moment(b[0], "DD-MMM-YYYY");

      return dateB.valueOf() - dateA.valueOf(); // newest first
    })
    .map(([title, data]) => ({ title, data }));

  return sortedSections;
};
