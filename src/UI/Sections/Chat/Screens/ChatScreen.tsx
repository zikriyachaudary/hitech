import React, { useEffect, useState, useRef } from "react";
import {
  View,
  SafeAreaView,
  StyleSheet,
  Keyboard,
  SectionList,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Modal,
  PermissionsAndroid,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import ImagePicker from "react-native-image-crop-picker";
import DocumentPicker, { types } from "react-native-document-picker";
import moment = require("moment");
import MyMessage from "../Components/MyMessages";
import OtherUserMessage from "../Components/OtherUserMessage";
import ChatBar from "../Components/ChatBar";
import PdfView from "../Components/PdfView";
import ChatImageView from "../Components/ChatImageView";
import RNFS from "react-native-fs";
import {
  AppColors,
  ScreenProps,
  hv,
  isSmallDevice,
  normalized,
} from "../../../../Utils/AppConstants";
import ThreadManager from "../../../../ChatModule/ThreadManger";
import CommonDataManager from "../../../../Utils/CommonManager";
import ChatHeader from "../Components/ChatHeader";
import {
  setIsAlertShow,
  setIsLoader,
  setIsShowNoti,
  setPushNotifiObj,
  setTab,
} from "../../../../Redux/Reducers/AppReducers";
import { CommonActions } from "@react-navigation/native";
import { Routes } from "../../../../Utils/Routes";
import MediaSelectionModal from "../Components/MediaSelectionModal";

const ChatScreen = (props: ScreenProps) => {
  const selector = useSelector((AppState: any) => AppState.SliceReducer);
  const thread = props?.route?.params?.thread
    ? props?.route?.params?.thread
    : [];
  var selectedUrl: any = useRef();
  const [openSelectionMediaModal, setOpenSelectionMediaModal] = useState(false);
  const dispatch = useDispatch();
  const scrollToBottomRef: any = useRef(null);
  const [message, setMessage] = useState("");
  const currentlyVisibleMessages = useRef([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const userId = selector?.userData?.userId?.toString();
  const [otherUserStatus] = useState(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const threadSelector = useSelector(
    (AppState: any) => AppState.SliceReducer.threadList
  );
  const [currentUserData] = useState(
    selector?.userData?.user ? selector?.userData?.user : selector?.userData
  );
  const [visibleMessages, setVisibleMessage] = useState([]);
  const [showPdf, setShowPdf] = useState(false);
  const [showImageView, setShowImageView] = useState(false);
  var allMessages: any = useRef();
  var otherUserRef: any = useRef();
  var initialMessageRef: any = useRef();
  var threadRef: any = useRef();
  var initialCall: any = useRef();
  useEffect(() => {
    if (props?.route?.params?.thread) {
      getOtherUpdatedData();
    }
    return () => {
      dispatch(setIsShowNoti(false));
      dispatch(setPushNotifiObj(null));
      ThreadManager.instance.removeMessageListener();
    };
  }, [props?.route?.params?.thread]);

  const getOtherUpdatedData = async () => {
    let participants = props?.route?.params?.thread
      ? typeof props?.route?.params?.thread?.participants == "string"
        ? JSON.parse(props?.route?.params?.thread?.participants)
        : props?.route?.params?.thread?.participants
      : typeof thread.participants == "string"
      ? JSON.parse(thread.participants)
      : thread.participants;
    let otherIndex = participants.findIndex(
      (value: any) => value.user != userId
    );
    if (otherIndex != -1) {
      // await fetchProfileReq(participants[otherIndex]?.user, (response: any) => {
      //   if (response?.status) {
      //     setOtherUser(response?.data);
      //   }
      // });
    }
  };

  useEffect(() => {
    threadRef.current = thread;
    initialMessageRef.current = 50;
    getInitialMessageList();
    clearCount();
    return () => {
      dispatch(setIsShowNoti(false));
      dispatch(setPushNotifiObj(null));
      ThreadManager.instance.removeMessageListener();
    };
  }, []);
  useEffect(() => {
    let index = threadSelector.findIndex(
      (item: any) => item.channelID == threadRef.current.channelID
    );
    if (index !== -1) {
      let count = 0;
      let findedThread = threadSelector[index];
      threadRef.current = findedThread;
      if (threadRef.current[`${userId}$$`]) {
        count = threadRef.current[`${userId}$$`];
      }
      if (count > 0) {
        clearCount();
      }
    }
  }, [threadSelector]);

  const clearCount = () => {
    ThreadManager.instance.clearUnreadCount(threadRef.current, userId);
  };

  const getInitialMessageList = () => {
    dispatch(setIsLoader(true));
    ThreadManager.instance.getInitialThreadMessages(
      threadRef.current.channelID,
      (messageList: any) => {
        dispatch(setIsLoader(false));
        allMessages.current = messageList;
        createSectionData();
        setTimeout(() => {
          listMessageListener();
        }, 2000);
      }
    );
  };
  const createSectionData = (isScrollBottom = true) => {
    let data: any = [];
    allMessages.current.sort((s1: any, s2: any) => {
      let firstObj: any = moment(
        s1.created,
        ThreadManager.instance.dateFormater.fullDate
      ).toDate();
      let secondObj: any = moment(
        s2.created,
        ThreadManager.instance.dateFormater.fullDate
      ).toDate();
      return secondObj - firstObj;
    });
    let messsges = allMessages.current.slice(0, initialMessageRef.current);

    if (messsges?.length > 0) {
      messsges.forEach((item: any) => {
        let findedDate = moment(
          moment(item.created, ThreadManager.instance.dateFormater.fullDate)
        );
        let date = findedDate.format(ThreadManager.instance.dateFormater.month);
        let index = data.findIndex((obj: any) => obj.title == date);
        let timeDate = findedDate.format(
          ThreadManager.instance.dateFormater.time
        );
        let newItem = {
          ...item,
          type: userId == item?.senderID ? "Owner" : "guest",
          time: timeDate,
        };

        if (index == -1) {
          let newObj = {
            title: date,
            data: [newItem],
          };
          data.push(newObj);
        } else {
          let findedObj = data[index];
          let finedList = findedObj.data;
          finedList.push(newItem);
          findedObj.data = finedList;
          data[index] = findedObj;
        }
      });
    }

    currentlyVisibleMessages.current = data;
    setVisibleMessage(data);
    if (data?.length > 0) {
      if (isScrollBottom) {
        setTimeout(() => {
          scrollToEnd();
        }, 1000);
      }
    }
  };

  const listMessageListener = () => {
    ThreadManager.instance.setUpMessageListener(
      threadRef.current.channelID,
      (docList: any) => {
        let newDocsCount = 0;
        let lastSeenerMessageList: any = [];
        docList.forEach((item: any) => {
          let data = item.data;
          if (data.senderID != userId && data.lastMessageSeeners.length == 0) {
            lastSeenerMessageList.push(data);
          }
          let index = allMessages.current.findIndex(
            (item: any) => item.messageId == data.messageId
          );
          if (index != -1) {
            allMessages.current[index] = data;
          } else {
            if (initialCall.current == false) {
              newDocsCount += 1;
            }
            allMessages.current.push(data);
          }
        });
        if (initialCall.current) {
          initialCall.current = false;
        }
        initialMessageRef.current = initialMessageRef.current + newDocsCount;
        createSectionData();
        if (lastSeenerMessageList.length > 0) {
          let user = selector.userData?.user
            ? selector.userData?.user
            : selector.userData;
          ThreadManager.instance.updateMessageSeener(
            thread.channelID,
            lastSeenerMessageList,
            user.userId
          );
        }
      }
    );
  };
  const onTopReached = () => {
    initialMessageRef.current = initialMessageRef.current + 50;
    createSectionData(false);
  };
  const scrollToEnd = () => {
    if (visibleMessages.length > 0) {
      scrollToBottomRef.current?.scrollToLocation({
        animated: true,
        sectionIndex: 0,
        itemIndex: 0,
        viewPosition: 0,
      });
    }
  };
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      () => {
        setKeyboardVisible(false);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      () => {
        setKeyboardVisible(true);
      }
    );
    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, [isKeyboardVisible]);

  const setName = () => {
    let name = "";
    let participants = threadRef.current
      ? typeof threadRef.current.participants == "string"
        ? JSON.parse(threadRef.current.participants)
        : threadRef.current.participants
      : typeof thread.participants == "string"
      ? JSON.parse(thread.participants)
      : thread.participants;
    if (participants?.length > 0) {
      let otherUserIndex = participants.findIndex(
        (value: any) => value.user != userId
      );
      if (otherUserIndex != -1) {
        otherUserRef.current = participants[otherUserIndex];
        name = participants[otherUserIndex]?.userName;
      }

      return name;
    }
  };
  const onSendMessage = (params: any) => {
    let messageId = ThreadManager.instance.makeId(8);

    let currentDate = moment
      .utc(new Date())
      .format(ThreadManager.instance.dateFormater.fullDate);
    let data: any = {
      created: currentDate,
      createdAt: currentDate,
      senderID: userId,
      senderName: currentUserData?.fullName || "",
      senderProfilePictureURL: currentUserData?.profile_Image || "",
      recipientID: otherUserRef?.current?.user,
      recipientName: otherUserRef.current?.userName,
      recipientProfilePictureURL: otherUserRef.current?.userProfileImageUrl,
      lastMessageSeeners: [],
      messageId: messageId,
      content: message,
      ...params,
    };
    let lastMessage = "";
    if (data["content"]) {
      lastMessage = data["content"];
    }

    if (data["url"]) {
      lastMessage = "Photo";
    }
    if (data["videoUrl"]) {
      lastMessage = "Video";
    }
    if (data["documentUrl"]) {
      lastMessage = "Document";
    }

    if (params?.reply) {
      data["reply"] = params.reply;
    }
    if (params?.marked) {
      data["marked"] = params.marked;
    }
    if (params["audioUrl"]) {
      data["audioUrl"] = params.audioUrl;
      data["audioDuration"] = params.audioDuration;
      lastMessage = "Audio";
    }
    let newParams = {
      ...data,
      send: false,
    };

    allMessages.current.push(newParams);
    initialMessageRef.current = initialMessageRef.current + 1;
    createSectionData();
    ThreadManager.instance
      .sendMessage(threadRef.current.channelID, data)
      .then(() => {
        let payload = {
          reply: params?.reply ? params.reply : null,
          marked: params?.marked ? params.marked : null,
        };
        ThreadManager.instance.updateLastThreadMessage(
          threadRef.current,
          lastMessage,
          otherUserRef.current,
          currentDate,
          payload
        );

        setTimeout(() => {
          ThreadManager.instance.fetchMessageData(
            threadRef.current.channelID,
            data?.messageId,
            (response: any) => {
              if (response?.length == 0) {
                let fullName = currentUserData?.fullName || "";
                ThreadManager.instance.generatePushNotification(
                  threadRef.current,
                  {
                    userName:
                      CommonDataManager.getSharedInstance().capitalizeFirstLetter(
                        fullName
                      ),
                  },
                  otherUserRef.current,
                  lastMessage
                );
              }
            }
          );
        }, 1000);
      })
      .catch((error) => {});
  };

  const mediaSelection = (option?: any) => {
    ImagePicker.openPicker({
      multiple: false,
      mediaType: "photo",
      compressImageQuality: 0.5,
    }).then((images: any) => {
      setOpenSelectionMediaModal(false);
      dispatch(setIsLoader(true));
      ThreadManager.instance.uploadMedia(images.path, false, (url: any) => {
        if (url != "error") {
          let params: any = {};
          params["url"] = url;
          dispatch(setIsLoader(false));
          onSendMessage(params);
        } else {
          dispatch(setIsLoader(false));

          Alert.alert("", "Error while uploading media");
        }
      });
    });
  };

  const checkAndroidPermission = async () => {
    try {
      if (Platform.OS === "android") {
        if (Platform.Version < 29) {
          const granted = await PermissionsAndroid.requestMultiple([
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          ]);
          if (
            granted["android.permission.READ_EXTERNAL_STORAGE"] ===
              PermissionsAndroid.RESULTS.GRANTED &&
            granted["android.permission.WRITE_EXTERNAL_STORAGE"] ===
              PermissionsAndroid.RESULTS.GRANTED
          ) {
            documentSelection();
          }
        } else if (Platform.Version < 30) {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            documentSelection();
          }
        } else {
          documentSelection();
        }
      } else {
        documentSelection();
      }
    } catch (e) {
      console.error("Error checking storage permissions:", e);
    }
  };

  const documentSelection = async () => {
    DocumentPicker.pick({
      presentationStyle: "formSheet",
      type: types.pdf,
      allowMultiSelection: false,
    })
      .then(async (pdf) => {
        setOpenSelectionMediaModal(false);
        const result = pdf[0];
        dispatch(setIsLoader(true));
        let urls = await getPathForFirebaseStorage(result.uri);
        ThreadManager.instance.uploadMedia(urls, false, (url: any) => {
          dispatch(setIsLoader(false));
          if (url != "error") {
            let params = {
              documentUrl: url,
              documentName: result?.name || "",
            };
            onSendMessage(params);
          } else {
            Alert.alert("", "Error while uploading media");
          }
        });
      })
      .catch((e) => {});
  };
  const getPathForFirebaseStorage = async (uri: any) => {
    if (Platform.OS == "ios") {
      return uri;
    } else {
      const destPath = `${
        RNFS.TemporaryDirectoryPath
      }/${ThreadManager.instance.makeId(5)}`;
      await RNFS.copyFile(uri, destPath);
      let data = await RNFS.stat(destPath);
      return data.path;
    }
  };

  return (
    <>
      <SafeAreaView style={{ backgroundColor: AppColors.white.white }} />
      <View style={styles.container}>
        <ChatHeader
          otherUserStatus={otherUserStatus}
          title={setName()}
          profile={otherUserRef?.current?.userProfileImageUrl}
          atBackPress={() => {
            if (props?.navigation?.canGoBack()) {
              props?.navigation?.goBack();
            } else {
              props?.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: Routes.Main.container }],
                })
              );
              dispatch(setTab(0));
            }
          }}
          showBorder={true}
          atRightBtn={() => {}}
        />
        <View
          style={{
            flex: 1,
            paddingHorizontal: normalized(5),
          }}
        >
          <SectionList
            inverted
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              onTopReached();
            }}
            ref={scrollToBottomRef}
            showsVerticalScrollIndicator={false}
            stickySectionHeadersEnabled={false}
            sections={visibleMessages}
            keyExtractor={(item, index) => `${index}`}
            renderItem={({ item, index, section }) => {
              return (
                <View style={styles.sectionListCon}>
                  {item.type == "Owner" ? (
                    <MyMessage
                      item={item}
                      onPdf={() => {
                        selectedUrl.current = item.documentUrl;
                        setShowPdf(true);
                      }}
                      onImage={() => {
                        selectedUrl.current = { url: item.url };
                        setShowImageView(true);
                      }}
                      atProfilePress={() => {}}
                      navigation={props.navigation}
                      playVideo={(obj: any) => {}}
                    />
                  ) : (
                    <OtherUserMessage
                      otherUserData={otherUserRef.current}
                      item={item}
                      onPdf={() => {
                        selectedUrl.current = item.documentUrl;
                        setShowPdf(true);
                      }}
                      onImage={() => {
                        selectedUrl.current = { url: item.url };
                        setShowImageView(true);
                      }}
                      navigation={props.navigation}
                      playVideo={(obj: any) => {}}
                    />
                  )}
                </View>
              );
            }}
            renderSectionFooter={({ section }: any) => {
              return (
                <View
                  style={{
                    flex: 1,
                    paddingTop: 10,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <View style={styles.simpleLine} />
                  <Text
                    style={{
                      marginHorizontal: normalized(15),
                      fontSize: normalized(14),
                      paddingVertical: hv(4),
                      color: AppColors.black.black,
                      textAlign: "center",
                    }}
                  >{`${section.title} (${moment(
                    section.title,
                    "YYYY-MM-DD"
                  ).format("ddd")})`}</Text>
                  <View style={styles.simpleLine} />
                </View>
              );
            }}
            renderSectionHeader={({ section }) => {
              return null;
            }}
          />
        </View>

        <KeyboardAvoidingView
          keyboardVerticalOffset={
            Platform.OS === "ios"
              ? isSmallDevice
                ? normalized(20)
                : normalized(50)
              : -5
          }
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          <View style={styles.chatBarStyle}>
            <ChatBar
              onAttachmentPress={() => {
                Keyboard.dismiss();
                setOpenSelectionMediaModal(true);
              }}
              onSendPress={() => {
                if (!selector?.isNetConnected) {
                  dispatch(
                    setIsAlertShow({
                      value: true,
                      message: "Please check your internet and try again!",
                    })
                  );

                  return;
                }
                const newMessage =
                  CommonDataManager.getSharedInstance().removeEmptyLines(
                    message
                  );
                if (newMessage != "") {
                  setMessage("");
                  let params = {
                    content: newMessage,
                  };
                  onSendMessage(params);
                }
                setMessage("");
              }}
              smileBtnPress={() => {}}
              audioBtnPress={() => {}}
              value={message}
              onChangeText={(m: any) => {
                setMessage(m);
              }}
              isDisable={false}
            />
          </View>
        </KeyboardAvoidingView>
      </View>
      <SafeAreaView style={{ backgroundColor: AppColors.white.white }} />
      <Modal visible={showPdf} presentationStyle="fullScreen">
        <PdfView url={selectedUrl.current} onClose={() => setShowPdf(false)} />
      </Modal>
      {showImageView ? (
        <ChatImageView
          showImageView={showImageView}
          imagesList={[selectedUrl.current]}
          onClose={() => setShowImageView(false)}
        />
      ) : null}
      {openSelectionMediaModal ? (
        <MediaSelectionModal
          onClose={() => {
            setOpenSelectionMediaModal(false);
          }}
          atPress={(type: any) => {
            if (type == "upload image") {
              mediaSelection();
            } else {
              if (Platform.OS == "android") {
                checkAndroidPermission();
              } else {
                documentSelection();
              }
            }
          }}
        />
      ) : null}
    </>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white.white,
  },
  chatBarStyle: {
    maxHeight: hv(100),
    marginHorizontal: normalized(5),
  },
  chatView: {
    flex: 1,
    paddingHorizontal: normalized(8),
  },
  specificTime: {
    fontSize: normalized(14),
    paddingVertical: hv(4),
    color: AppColors.grey.greyLevel3,
    textAlign: "center",
  },
  sectionListCon: {
    paddingHorizontal: normalized(8),
    paddingTop: hv(15),
  },
  simpleLine: {
    height: normalized(1),
    width: normalized(90),
    backgroundColor: "#E8E6EA",
  },
});

export default ChatScreen;
