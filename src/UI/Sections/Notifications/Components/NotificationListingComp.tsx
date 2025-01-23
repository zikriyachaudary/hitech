import React, { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AppImageViewer from "../../../Components/AppImageView";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  fullDate,
  normalized,
} from "../../../../Utils/AppConstants";
import moment from "moment";
import ImageViewModal from "../../../Components/CustomModal/ImageViewModal";

const NotificationListingComp = (props: any) => {
  const [time, setTime] = useState("");
  const [imageView, setImageView] = useState({
    initialIndex: 0,
    imagesList: [],
    value: false,
  });

  const item = props?.singleItem;

  useEffect(() => {
    if (props?.singleItem?.createdAt) {
      let findedDate = moment(moment(props?.singleItem?.createdAt, fullDate));
      setTime(moment(findedDate).fromNow());
    }
  }, [props?.singleItem]);

  return (
    <>
      <TouchableOpacity
        style={styles.mainCont}
        activeOpacity={1}
        onPress={() => {}}
      >
        <TouchableOpacity
          onPress={() => {
            setImageView({
              initialIndex: 0,
              imagesList: [
                { url: item?.sender?.profile || item?.reciever?.profile },
              ],
              value: true,
            });
          }}
          style={styles.profileImg}
        >
          <AppImageViewer
            resizeMode={"cover"}
            source={{ uri: item?.sender?.profile || item?.reciever?.profile }}
            style={styles.profileImg}
          />
        </TouchableOpacity>
        <View style={{ marginStart: 10, maxWidth: "63%" }}>
          <Text style={styles.title}>{item?.title}</Text>
          <Text numberOfLines={2} style={styles.des}>
            {item?.body}
          </Text>
        </View>
        <Text style={styles.timeTxt} numberOfLines={2}>
          {time}
        </Text>
      </TouchableOpacity>
      <View style={styles.line} />
      {imageView?.value && (
        <ImageViewModal
          isVisible={true}
          onClose={() => {
            setImageView({ value: false, imagesList: [], initialIndex: 0 });
          }}
          imagesList={imageView?.imagesList}
          initialIndex={imageView?.initialIndex}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  mainCont: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingVertical: 15,
    alignItems: "center",
  },
  profileImg: {
    width: normalized(40),
    height: normalized(40),
    borderRadius: normalized(50 / 2),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    alignSelf: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: normalized(14),
    color: AppColors.black.black,
    fontFamily: AppFonts.PoppinsMedium,
  },
  des: {
    fontSize: normalized(12),
    color: AppColors.grey.greyLevel8,
    fontFamily: AppFonts.PoppinsRegular,
  },
  line: {
    width: "100%",
    backgroundColor: AppColors.grey.greyLevel3,
    height: 1,
  },
  timeTxt: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.grey.greyLevel8,
    position: "absolute",
    right: 10,
    width: normalized(60),
  },
});

export default NotificationListingComp;
