import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Linking,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import Hyperlink from "react-native-hyperlink";
import SingleImageItem from "./SingleImageItem";
import SingleDocItem from "./SingleDocItem";
import {
  AppColors,
  AppImages,
  hv,
  normalized,
} from "../../../../Utils/AppConstants";

const MyMessage = ({ item, onPdf, onImage, playVideo, atLongPress }: any) => {
  const [layoutHeight, setLayoutHeight] = useState(0);
  const [messageRead, setMessageRead] = useState(false);
  useEffect(() => {
    checkMessageRead();
  }, [item]);

  const checkMessageRead = () => {
    if (item?.lastMessageSeeners?.length > 0) {
      setMessageRead(true);
    } else {
      setMessageRead(false);
    }
  };
  const onLayout = (e: any) => {
    const { height } = e.nativeEvent.layout;
    setLayoutHeight(height);
  };

  const setContainerComponent = () => {
    if (item["url"]) {
      return <SingleImageItem item={item} onPress={() => onImage()} />;
    }

    if (item["documentUrl"]) {
      return <SingleDocItem item={item} onOpen={() => onPdf()} />;
    }

    return (
      <View style={styles.messageCon}>
        {item?.replyAt && (
          <View
            style={{
              padding: normalized(10),
              borderRadius: normalized(5),
              marginBottom: normalized(10),
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center",
              backgroundColor: AppColors.grey.light,
            }}
          >
            <View
              style={{
                backgroundColor: AppColors.themeColor.dark,
                height: normalized(
                  item?.replyAt?.content?.length > 60 ? 50 : 30
                ),
                width: normalized(2),
              }}
            />
            <Text
              style={{
                color: AppColors.black.black,
                fontSize: normalized(14),
                marginHorizontal: normalized(10),
              }}
              numberOfLines={3}
            >
              {item?.replyAt?.content}
            </Text>
          </View>
        )}

        <Hyperlink
          linkStyle={{ color: "#2980b9", fontSize: normalized(16) }}
          onPress={(url: any) => {
            if (item?.callUrl) {
              Linking.canOpenURL(item?.callUrl).then((supported) => {
                Linking.openURL(item?.callUrl);
              });
            } else {
              Linking.canOpenURL(url).then((supported) => {
                Linking.openURL(url);
              });
            }
          }}
        >
          <Text style={styles.message}>{item.content}</Text>
        </Hyperlink>
      </View>
    );
  };

  return (
    <TouchableOpacity
      onLayout={onLayout}
      activeOpacity={1}
      onLongPress={(e) => {
        if (item?.actionType != "Delete") {
          atLongPress(e, { ...item, layoutHeight });
        }
      }}
    >
      <View style={styles.container}>{setContainerComponent()}</View>
      <View style={styles.timeTextCon}>
        {item?.react && item?.actionType !== "Delete" && (
          <View
            style={{
              backgroundColor: AppColors.white.white,
              height: normalized(20),
              width: normalized(25),
              borderRadius: normalized(10),
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
              zIndex: 1,
              top: -10,
              right: 5,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Text style={{ fontSize: normalized(14) }}>{item?.react}</Text>
          </View>
        )}
        <View
          style={{
            flexDirection: "row",
            marginTop: normalized(item?.react?.length > 0 ? 10 : 3),
          }}
        >
          <Text style={styles.timeText}>
            {moment(item?.time, "HH:mm:ss").format("hh:mm A")}
          </Text>
          <Image
            source={AppImages.Chat.msgSeen}
            style={{
              tintColor: messageRead ? AppColors.themeColor.dark : "#979797",
            }}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};
const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginStart: normalized(40),
    marginVertical: hv(3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3,
  },
  my_image: {
    width: normalized(26),
    height: normalized(26),
    resizeMode: "contain",
  },
  messageCon: {
    marginEnd: normalized(4),
    backgroundColor: AppColors.white.white,
    padding: normalized(15),
    borderRadius: normalized(15),
    borderBottomRightRadius: 0,
  },
  message: {
    fontSize: normalized(16),
    color: AppColors.black.black,
  },
  timeTextCon: {
    alignSelf: "flex-end",
  },
  timeText: {
    fontSize: normalized(11),
    color: AppColors.black.black,
    textAlign: "right",
    marginEnd: normalized(4),
  },
});

export default MyMessage;
