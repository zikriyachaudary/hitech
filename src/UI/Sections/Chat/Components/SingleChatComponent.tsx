import moment from "moment";
import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ThreadManager from "../../../../ChatModule/ThreadManger";
import { removeEmptyLines } from "../../../../Utils/Helper";
import AppImageViewer from "../../../Components/AppImageView";
import {
  AppColors,
  AppHorizontalMargin,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";
const SingleChatComponent = (props: any) => {
  const [time, setTime] = useState("");
  const [count, setUnreadCount] = useState<any>(
    props?.obj[`${[props.obj.participants[props?.findedIndex].user]}$$`]
      ? `${props?.obj[props?.obj.participants[props?.findedIndex].user]}`
      : 0
  );

  useEffect(() => {
    checkUnreadCount();
  }, [props?.obj]);

  const checkUnreadCount = () => {
    if (props?.obj?.createdAt) {
      let findedDate = moment(
        moment(
          props?.obj?.createdAt,
          ThreadManager.instance.dateFormater.fullDate
        )
      );
      setTime(moment(findedDate).fromNow());
    }
    if (props?.obj[`${[props?.obj.participants[props?.findedIndex].user]}$$`]) {
      setUnreadCount(
        props?.obj[`${[props?.obj.participants[props?.findedIndex].user]}$$`]
      );
    } else {
      setUnreadCount(0);
    }
  };

  const renderImage = () =>
    useMemo(() => {
      return (
        <AppImageViewer
          source={{ uri: props?.profileImage }}
          style={styles.profilePic}
        />
      );
    }, [props?.profileImage]);
  return (
    <>
      <TouchableOpacity activeOpacity={1} onPress={() => props?.atPress()}>
        <View style={styles.mainContainer}>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              onPress={() => {
                if (props?.goToProfile) {
                  props?.goToProfile();
                }
              }}
            >
              {renderImage()}
            </TouchableOpacity>

            <View style={styles.userContainer}>
              <Text numberOfLines={1} style={styles.userName}>
                {props?.name}
              </Text>

              <Text numberOfLines={2} style={styles.msg}>
                {removeEmptyLines(props?.msg)}
              </Text>
            </View>
          </View>
          <View style={styles.timeContainer}>
            <Text style={styles.timeTxt}>{time}</Text>
            {count > 0 ? (
              <View style={styles.counterContainer}>
                {count?.length > 99 ? (
                  <Text style={styles.counterTxt}>+99</Text>
                ) : (
                  <Text style={styles.counterTxt}>{count}</Text>
                )}
              </View>
            ) : (
              <View />
            )}
          </View>
        </View>
      </TouchableOpacity>
      <View style={styles.bottomLine} />
    </>
  );
};
const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: AppHorizontalMargin,
  },
  innerContainer: {
    flexDirection: "row",
    alignSelf: "flex-start",
    flex: 1,
  },
  profilePic: {
    height: normalized(50),
    width: normalized(50),
    borderRadius: normalized(25),
  },
  userContainer: {
    flex: 1,
    marginStart: normalized(10),
    justifyContent: "center",
  },
  userName: {
    fontSize: normalized(14),
    fontWeight: "500",
    color: AppColors.black.black,
  },
  msg: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.grey.greyLevel10,
    maxWidth: "85%",
  },
  timeContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
    paddingLeft: 5,
  },
  timeTxt: {
    fontSize: normalized(12),
    fontWeight: "400",
    color: AppColors.grey.greyLevel10,
  },
  counterContainer: {
    backgroundColor: AppColors.themeColor.dark,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: normalized(10),
    height: normalized(15),
    width: normalized(15),
  },
  counterTxt: {
    fontSize: 10,
    color: AppColors.white.white,
  },
  bottomLine: {
    height: hv(1),
    backgroundColor: AppColors.grey.greyLevel10,
  },
});
export default SingleChatComponent;
