import React, { useEffect, useState } from "react";
import { FlatList, Image, SafeAreaView, Text, View } from "react-native";
import { useSelector } from "react-redux";
import { filterListAndSorted, setUpChat } from "../../../../Utils/Helper";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import {
  AppColors,
  AppImages,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import SingleChatComponent from "../Components/SingleChatComponent";
import { Routes } from "../../../../Utils/Routes";
import { useIsFocused } from "@react-navigation/native";
const ChatListingScreen = (props: ScreenProps) => {
  const isFocused = useIsFocused();
  const { threadList, userData } = useSelector(
    (state: any) => state.SliceReducer
  );

  const [chatList, setChatList] = useState([]);
  useEffect(() => {
    if (isFocused) {
      setUpChat(async (result: any) => {});
    }
  }, [isFocused]);
  useEffect(() => {
    let mList = filterListAndSorted(threadList);
    if (mList.length > 0) {
      setChatList(mList);
    }
  }, [threadList]);
  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        onPress={() => {
          props?.navigation?.goBack();
        }}
        title={`Message's`}
      />

      {chatList?.length > 0 ? (
        <>
          <FlatList
            showsVerticalScrollIndicator={false}
            style={{ flex: 1 }}
            data={chatList}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index }: any) => {
              let findedIndex = item?.participants.findIndex(
                (value: any) => value.user == userData?.userId?.toString()
              );
              let otherUserIndex = item?.participants.findIndex(
                (value: any) => value.user != userData?.userId
              );
              if (findedIndex != -1) {
                return (
                  <SingleChatComponent
                    otherUserIndex={otherUserIndex}
                    findedIndex={findedIndex}
                    obj={item}
                    name={item.participants[otherUserIndex].userName}
                    profileImage={
                      item.participants[otherUserIndex].userProfileImageUrl
                    }
                    msg={item.lastMessage}
                    item={item}
                    atPress={() => {
                      props?.navigation.navigate(Routes.Chat.ChatScreen, {
                        thread: item,
                        from: Routes.Chat.ChatListing,
                      });
                    }}
                  />
                );
              }
            }}
            ListEmptyComponent={() => {
              return (
                <View
                  style={{
                    height: 300,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: AppColors.black.black,
                      fontSize: normalized(16),
                    }}
                  >
                    No search result found
                  </Text>
                </View>
              );
            }}
          />
        </>
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            paddingHorizontal: normalized(30),
          }}
        >
          <Image source={AppImages.Chat.emptyChat} style={{ width: "80%" }} />
          <Text
            style={{
              textAlign: "center",
              color: AppColors.black.black,
              fontSize: normalized(16),
              fontWeight: "400",
              marginTop: hv(30),
            }}
          >
            Welcome to inbox!
          </Text>
          <Text
            style={{
              textAlign: "center",
              color: AppColors.grey.greyLevel7,
              fontSize: normalized(12),
              fontWeight: "400",
              marginVertical: hv(10),
            }}
          >
            Here you’ll find all private conversations between you and your
            Participant's
          </Text>
        </View>
      )}
    </View>
  );
};
export default ChatListingScreen;
