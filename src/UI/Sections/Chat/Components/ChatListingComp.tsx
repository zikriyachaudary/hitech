import React, { useEffect, useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import moment from "moment";
import ThreadManager from "../../../../ChatModule/ThreadManger";
import AppImageViewer from "../../../Components/AppImageView";
import { AppColors, normalized } from "../../../../Utils/AppConstants";
import { removeEmptyLines } from "../../../../Utils/Helper";

const ChatListingComp = (props: any) => {
  const [time, setTime] = useState("");
  const [count, setUnreadCount] = useState<any>(
    props?.item[`${[props.item.participants[props?.findedIndex].user]}$$`]
      ? `${props?.item[props?.item.participants[props?.findedIndex].user]}`
      : 0
  );

  useEffect(() => {
    checkUnreadCount();
  }, [props?.item]);

  const checkUnreadCount = () => {
    if (props?.item?.createdAt) {
      let findedDate = moment(
        moment(
          props?.item?.createdAt,
          ThreadManager.instance.dateFormater.fullDate
        )
      );
      setTime(moment(findedDate).fromNow());
    }
    if (
      props?.item[`${[props?.item.participants[props?.findedIndex].user]}$$`]
    ) {
      setUnreadCount(
        props?.item[`${[props?.item.participants[props?.findedIndex].user]}$$`]
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
    <TouchableOpacity
      activeOpacity={1}
      style={styles.mainCont}
      onPress={() => {
        props?.atSingleItemPress();
      }}
    >
      <TouchableOpacity
        style={{
          marginEnd: normalized(10),
        }}
        onPress={() => {
          if (props?.goToProfile) {
            props?.goToProfile();
          }
        }}
      >
        {renderImage()}
      </TouchableOpacity>
      <View style={{ flex: 1 }}>
        <Text style={styles.name} numberOfLines={2}>
          {props?.name}
        </Text>
        <Text style={styles.timeTxt}>{time}</Text>
        <View style={styles.innerCont}>
          <Text style={styles.msg} numberOfLines={3}>
            {removeEmptyLines(props?.msg)}
          </Text>
          {count > 0 && (
            <View style={styles.countCont}>
              {count > 99 ? (
                <Text style={styles.countTxt}>+99</Text>
              ) : (
                <Text style={styles.countTxt}>{count}</Text>
              )}
            </View>
          )}
        </View>
        {props?.isShowBottomLine && <View style={styles.bottomLine} />}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  mainCont: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    flex: 1,
    paddingVertical: normalized(10),
  },
  profilePic: {
    height: normalized(50),
    width: normalized(50),
    borderRadius: normalized(50 / 2),
  },
  name: {
    color: AppColors.black.black,
    fontSize: normalized(15),
    fontWeight: "500",
    maxWidth: normalized(200),
  },
  timeTxt: {
    color: AppColors.grey.greyLevel10,
    fontSize: normalized(14),
    fontWeight: "400",
    position: "absolute",
    right: 0,
  },
  innerCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    flex: 1,
  },
  msg: {
    color: AppColors.grey.greyLevel10,
    fontSize: normalized(13),
    fontWeight: "400",
    marginTop: normalized(10),
    maxWidth: normalized(250),
  },
  countCont: {
    height: normalized(20),
    width: normalized(20),
    borderRadius: normalized(20 / 2),
    backgroundColor: AppColors.themeColor.dark,
    justifyContent: "center",
    alignItems: "center",
    marginTop: normalized(5),
  },
  countTxt: {
    fontSize: normalized(13),
    color: AppColors.white.white,
  },
  bottomLine: {
    height: 1,
    backgroundColor: AppColors.grey.light,
    marginTop: normalized(10),
  },
});
export default ChatListingComp;
