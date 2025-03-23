import moment from "moment";
import React, { useState } from "react";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Hyperlink from "react-native-hyperlink";
import SingleImageItem from "./SingleImageItem";
import SingleDocItem from "./SingleDocItem";
import { AppColors, hv, normalized } from "../../../../Utils/AppConstants";
const OtherUserMessage = ({
  item,
  onPdf,
  onImage,
  playVideo,
  atLongPress,
}: any) => {
  const [layoutHeight, setLayoutHeight] = useState(0);

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
                marginHorizontal: 10,
              }}
              numberOfLines={3}
            >
              {item?.replyAt?.content}
            </Text>
          </View>
        )}
        <Hyperlink
          linkStyle={{ color: "#2980b9", fontSize: normalized(16) }}
          onPress={(url, text) => {
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

        <Text
          style={{
            ...styles.timeText,
            marginTop: normalized(item?.react?.length > 0 ? 8 : 3),
          }}
        >
          {moment(item.time, "HH:mm:ss").format("hh:mm A")}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    marginVertical: hv(3),
    marginEnd: normalized(40),
  },
  other_person_image: {
    width: normalized(26),
    height: normalized(26),
    resizeMode: "contain",
  },
  messageCon: {
    marginStart: normalized(4),
    backgroundColor: AppColors.themeColor.light,
    padding: normalized(8),
    borderRadius: normalized(15),
    borderBottomLeftRadius: 0,
  },
  message: {
    fontSize: normalized(14),
    color: AppColors.white.white,
  },
  timeTextCon: {
    alignSelf: "flex-start",
  },
  timeText: {
    fontSize: normalized(11),
    color: AppColors.black.black,
    marginStart: normalized(4),
  },
  image: {
    width: normalized(35),
    height: normalized(35),
    borderRadius: normalized(35 / 2),
  },
  online: {
    backgroundColor: AppColors.green.dark,
    height: normalized(10),
    width: normalized(10),
    borderRadius: normalized(10 / 2),
    position: "absolute",
    alignSelf: "flex-end",
    top: hv(24),
  },
});
export default OtherUserMessage;
