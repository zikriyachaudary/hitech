import moment from "moment";
import ThreadManager from "../ChatModule/ThreadManger";
import { AppColors, fullDate } from "./AppConstants";
import { getUserDataAsync } from "./AsyncStorage";

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
  const phoneRegex = /^(\+?[0-9]{11,13})$/;
  if (emailRegex.test(value)) {
    return { type: "email", isValid: true };
  } else if (phoneRegex.test(value)) {
    return { type: "phone", isValid: true };
  } else {
    return { type: "invalid", isValid: false };
  }
};

export const setUpChat = async (onComplete: any) => {
  let userDataa = await getUserDataAsync();
  let userId: any = userDataa?.userId;
  let newId = userId?.toString();
  await ThreadManager.instance.getUserThread(newId, async (list: any) => {
    await ThreadManager.instance.setupParticipantListener(newId);
    await ThreadManager.instance.setupThreadListener(newId);
    onComplete(true);
  });
};

export const filterListAndSorted = (threadList: any) => {
  let mList: any = [];
  if (threadList?.length > 0) {
    threadList.forEach((item: any) => {
      if (item?.createdAt) {
        mList.push(item);
      }
    });
  }
  mList = mList.sort((s1: any, s2: any) => {
    let firstObj = moment(s1.createdAt, fullDate).toDate().getTime();
    let secondObj = moment(s2.createdAt, fullDate).toDate().getTime();

    return secondObj - firstObj;
  });
  mList = mList.filter((item: any, index: any) => {
    return mList.indexOf(item) === index;
  });
  return mList;
};

const imagesExtension = [
  "png",
  "jpeg",
  "gif",
  "jpg",
  "TIFF",
  "EP",
  "DNG",
  "CR2",
  "CR3",
  "SRF",
  "SR2",
  "ARW",
  "ARQ",
];
const videoExtension = [
  "mp4",
  "avi",
  "mkv",
  "mov",
  "wmv",
  "webm",
  "flv",
  "vob",
  "ogg",
  "ogv",
  "drc",
  "gif",
  "gifv",
  "mng",
  "avi",
  "MTS",
  "M2TS",
  "TS",
  "qt",
  "yuv",
  "rm",
  "rmvb",
  "viv",
  "asf",
  "amv",
  "m4p",
  "m4v",
  "mpg",
  "mp2",
  "mpeg",
  "mpe",
  "mpv",
  "mpg",
  "mpeg",
  "m2v",
  "m4v",
  "svi",
  "3gp",
  "3g2",
  "mxf",
  "roq",
  "nsv",
  "flv",
  "f4v",
  "f4p",
  "f4a",
  "f4b",
];
const documentsExtension = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "msword",
  "csv",
  "INDD",
  "AI",
  "EPS",
  "PSD",
];
const audioExtension = ["mp3", "wav", "ogg"];

export const getFileTypeUsingUrl = (fileName: any) => {
  const mediaExtensions: any = {
    image: imagesExtension,
    video: videoExtension,
    document: documentsExtension,
    audio: audioExtension,
  };
  let extension = null;
  let type = null;
  const fileExtension = fileName.split(".").pop().toLowerCase();
  for (const fileType in mediaExtensions) {
    if (mediaExtensions[fileType].includes(fileExtension)) {
      extension = fileExtension === "jpeg" ? "jpg" : fileExtension;
      type = fileType;
    }
  }
  return type;
};

export const removeEmptyLines = (str: any) => {
  if (!str) return "";
  str = str.trim();
  return str.replace(/^\s+|\s+$/g, "");
};
