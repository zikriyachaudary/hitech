import firestore from "@react-native-firebase/firestore";
import { Platform } from "react-native";
import storage from "@react-native-firebase/storage";
import { setThreadList } from "../Redux/Reducers/AppReducers";
// import { NOTIFICATION_TYPES } from "../Utils/AppStrings";
// import { sendPushNotificationReq } from "../Network/GeneralServices";
import { fetchFCMTokenById } from "../Network/Services/AuthServices";

let CHANNEL_COLLECTION = "channels";
let PARTICIPATION_COLLECTION = "channel_participation";
let THREAD_COLLECITON = "thread";

class ThreadManager {
  static instance = new ThreadManager();
  threadSubscriber: any = null;
  participantSubscriber: any = null;
  messageSubscriber: any = null;
  selector: any = null;
  dispatch: any = null;
  threadList: any = [];
  isAppLoaded: any = false;
  dateFormater = {
    fullDate: "Y-MM-DD HH:mm:ss.SSS Z",
    month: "Y-MM-DD",
    time: "HH:mm:ss",
  };
  setAppLoaded = () => {
    this.isAppLoaded = true;
  };

  setupRedux(selector: any, dispatch: any) {
    this.selector = selector;
    this.dispatch = dispatch;
  }

  ////// Listener's --------------------------------------->
  setupThreadListener = async (userId: any) => {
    this.threadSubscriber = firestore()
      .collection(CHANNEL_COLLECTION)
      .where("users", "array-contains", userId)
      .onSnapshot((snapshot) => {
        var newDocs: any = [];
        if (snapshot?.docChanges()) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "modified") {
              newDocs.push(change.doc.data());
            }
            this.updateList(newDocs);
          });
        }
      });
  };
  ///----------
  setUpMessageListener = (threadId: any, onMessageUpdates: any) => {
    this.messageSubscriber = firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(threadId)
      .collection(THREAD_COLLECITON)
      .onSnapshot((snapDocs) => {
        var docsList: any = [];
        if (snapDocs?.docChanges) {
          snapDocs?.docChanges().forEach((change) => {
            if (change.type == "added") {
              docsList.push({
                type: "added",
                data: change.doc.data(),
              });
            }
            if (change.type == "modified") {
              docsList.push({
                type: "modified",
                data: change.doc.data(),
              });
            }
          });
        }

        if (docsList.length > 0) {
          onMessageUpdates(docsList);
        }
      });
  };
  ///----------
  setupParticipantListener = async (userId: any) => {
    this.participantSubscriber = firestore()
      .collection(PARTICIPATION_COLLECTION)
      .where("user", "==", userId)
      .onSnapshot((snapshot) => {
        var newDocs: any = [];
        if (snapshot?.docChanges()) {
          snapshot.docChanges().forEach((change) => {
            if (change.type === "added") {
              if (
                this.checkThreadExist(change.doc.data()["channel"]) == false
              ) {
                newDocs.push(change.doc.data());
              }
            }
            if (change.type === "removed") {
              this.removeThreadObj(change.doc.data()["channel"]);
            }
          });
          newDocs.map((doc: any) => {
            this.addNewThread(doc);
          });
        }
      });
  };
  ////////////////////////////////////////////////////////////

  ////// normal Function's --------------------------------------->

  updateList = (updatedDocsList: any) => {
    if (updatedDocsList.length > 0) {
      let newList = [];
      for (let i = 0; i < this.threadList.length; i++) {
        let obj = this.threadList[i];
        let index = updatedDocsList.findIndex(
          (item: any) => item.channelID == obj.channelID
        );
        if (index != -1) {
          let newObj = {
            ...obj,
            ...updatedDocsList[index],
          };
          newList.push(newObj);
        } else {
          newList.push(obj);
        }
      }
      this.threadList = newList;
      this.updateStateList();
    }
  };
  ///----------
  removeThreadObj = (channelId: any) => {
    let index = this.threadList.findIndex(
      (item: any) => item.channelID == channelId
    );
    if (index != -1) {
      firestore()
        .collection(CHANNEL_COLLECTION)
        .doc(channelId)
        .delete()
        .finally(() => {
          this.threadList.splice(index, 1);
          this.updateStateList();
        });
    }
  };
  ///----------
  checkThreadExist = (threadId: any) => {
    let isExist = false;
    if (this.threadList.length > 0) {
      let index = this.threadList.findIndex(
        (item: any) => item.channelID == threadId
      );
      if (index != -1) {
        isExist = true;
      }
    }
    return isExist;
  };
  ///----------
  removeThreadFromDB = (channelId: any) => {
    firestore()
      .collection(PARTICIPATION_COLLECTION)
      .where("channel", "==", channelId)
      .get()
      .then((snapDoc) => {
        if (snapDoc.docs.length > 0) {
          snapDoc.docs.forEach((doc) => {
            firestore()
              .collection(PARTICIPATION_COLLECTION)
              .doc(doc.id)
              .delete();
          });
        }
      });
  };
  ///----------
  addNewThread = (findedDoc: any) => {
    var collectionRef = firestore().collection(PARTICIPATION_COLLECTION);
    var channelFilter = collectionRef.where(
      "channel",
      "==",
      findedDoc["channel"]
    );
    var userFilter = channelFilter.where("user", "!=", findedDoc["user"]);
    userFilter.get().then((snapDoc) => {
      if (snapDoc.docs.length > 0) {
        let firstDoc = snapDoc.docs[0].data();
        firestore()
          .collection(CHANNEL_COLLECTION)
          .doc(findedDoc["channel"])
          .get()
          .then((findedThread) => {
            let thread = {
              ...findedThread.data(),
              participants: [findedDoc, firstDoc],
            };
            this.threadList = [...this.threadList, thread];

            this.updateStateList();
          });
      }
    });
  };
  ///----------
  // UPDATE STATE LIST
  updateStateList = () => {
    let newArray = [];
    for (let i = 0; i < this.threadList.length; i++) {
      let obj = this.threadList[i];
      let index = newArray.findIndex((item) => item.channelID == obj.channelID);
      if (index == -1) {
        newArray.push(obj);
      }
    }
    console.log("newArray ---0--   ", newArray);

    if (newArray?.length > 0) {
      this.dispatch(setThreadList(newArray));
      this.threadList = newArray;
    }
  };
  ///----------
  //Check is Already Connection or Not
  checkIsConnectionExist = async (
    senderId: any,
    reciverId: any,
    onComplete: any
  ) => {
    let threadListArr: any = this.threadList;
    let newArr: any = [];
    for (let i = 0; i < threadListArr.length; i++) {
      let threadObj = threadListArr[i];
      let participants = threadObj.participants;
      let isSenderIndex: any = participants.findIndex(
        (value: any) => value.user == senderId
      );
      let isReciverIndex: any = participants.findIndex(
        (value: any) => value.user == reciverId
      );
      if (isSenderIndex != -1 && isReciverIndex != -1) {
        newArr.push(threadObj);
      }
    }
    onComplete(newArr?.length > 0 ? newArr[0] : null);
  };
  ///----------
  getThreadCompleteObj = async (chanelId: string, onComplete: any) => {
    await firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(chanelId)
      .get()
      .then(async (findedThread) => {
        let completeThread = { ...findedThread.data() };
        let participantsList = await this.getAllDocumentsByChannel(chanelId);
        onComplete({ ...completeThread, participants: participantsList });
      });
  };
  ///----------
  getAllDocumentsByChannel = async (channelId: any) => {
    try {
      const snapDoc = await firestore()
        .collection(PARTICIPATION_COLLECTION)
        .where("channel", "==", channelId)
        .get();

      if (!snapDoc.empty) {
        const documents = snapDoc.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        return documents;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  ////////////////////////////////////////////////////////////

  ////// remove Listener's --------------------------------------->
  removeThreadObserver = () => {
    if (this.threadSubscriber) {
      this.threadSubscriber();
      this.participantSubscriber();
    }
  };
  ///----------
  removeUserThread = async (thread: any) => {
    for (let i = 0; i < thread?.length; i++) {
      let id = thread[i]?.channelID;
      if (id) {
        await firestore()
          .collection(CHANNEL_COLLECTION)
          .doc(id)
          .delete()
          .finally(() => {});
      }
    }
    this.threadList = [];
  };
  ///----------
  removeParticpant = async (id: any) => {
    await firestore()
      .collection(PARTICIPATION_COLLECTION)
      .where("user", "==", id)
      .get()
      .then((snapDoc) => {
        if (snapDoc.docs.length > 0) {
          snapDoc.docs.forEach((doc) => {
            if (doc.id) {
              firestore()
                .collection(PARTICIPATION_COLLECTION)
                .doc(doc.id)
                .delete();
            }
          });
        }
      });
  };
  ///----------
  removeMessageListener = () => {
    if (this.messageSubscriber) {
      this.messageSubscriber();
    }
  };

  ////////////////////////////////////////////////////////////

  // Clear Count when user seen any other user chat --------------------------------------->
  clearUnreadCount = (thread: any, userId: any) => {
    let data: any = {};
    data[`${userId}$$`] = 0;
    firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(thread.channelID)
      .update(data);
  };
  ////////////////////////////////////////////////////////////

  //intial Call to create Thread and Set Particpant --------------------------------------->
  onSendCall = async (
    sender: any,
    receiver: any,
    docId: any,
    msg: any,
    onComplete: any
  ) => {
    this.createThread(sender, receiver, docId, msg)
      .then(() => {
        this.createParticipant(sender, receiver, docId)
          .then(() => {
            let participantsList = [
              {
                channel: docId,
                user: sender?.id,
                isSender: true,
                userName: sender?.username
                  ? sender?.username
                  : sender?.firstName,
                userProfileImageUrl: sender?.image ? sender?.image : "",
              },
              {
                channel: docId,
                user: receiver?.id,
                isSender: false,
                userName: receiver?.username
                  ? receiver?.username
                  : receiver?.firstname,
                userProfileImageUrl: receiver?.image ? receiver?.image : "",
              },
            ];
            let threadData = {
              lastMessage: msg,
              name: "",
              creatorID: sender.id,
              channelID: docId,
              id: docId,
              users: [sender.id, receiver.id],
              participants: participantsList,
            };

            this.threadList = [...this.threadList, threadData];
            onComplete(threadData);
          })
          .catch((error) => {
            onComplete("error");
          });
      })
      .catch((err) => {
        onComplete("error===>", err);
      });
  };
  ///----------
  createThread = async (sender: any, receiver: any, docId: any, msg: any) => {
    let data = {
      lastMessage: msg,
      name: "",
      creatorID: sender?.id,
      channelID: docId,
      id: docId,
      users: [sender?.id, receiver?.id],
    };
    return firestore().collection(CHANNEL_COLLECTION).doc(docId).set(data);
  };
  ///----------
  createParticipant = async (sender: any, receiver: any, docId: any) => {
    let senderPromise = new Promise((resolve, reject) => {
      let senderPic = sender?.image
        ? sender?.image
        : sender.profileImage
        ? sender.profileImage
        : sender.profile_image;

      let data = {
        channel: docId,
        user: sender.id,
        isSender: true,
        userName: sender?.username
          ? sender.username
          : sender.firstName
          ? sender.firstName
          : "",
        userProfileImageUrl: senderPic ? senderPic : "",
      };
      firestore()
        .collection(PARTICIPATION_COLLECTION)
        .add(data)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(true);
        });
    });
    let receiverPromise = new Promise((resolve, reject) => {
      let data = {
        channel: docId,
        user: receiver?.id,
        isSender: false,
        userName: receiver?.username ? receiver?.username : receiver?.firstname,
        userProfileImageUrl: receiver?.image ? receiver?.image : "",
      };

      firestore()
        .collection(PARTICIPATION_COLLECTION)
        .add(data)
        .then(() => {
          resolve(true);
        })
        .catch(() => {
          reject(true);
        });
    });
    return Promise.all([senderPromise, receiverPromise]);
  };

  ////////////////////////////////////////////////////////////

  // MESSAGE intial thread fetch flow --------------------------------------->
  getInitialThreadMessages = (threadId: any, onMessageUpdates: any) => {
    firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(threadId)
      .collection(THREAD_COLLECITON)
      .limit(50)
      .orderBy("created", "desc")
      .get()
      .then((snapShot) => {
        var messagesList: any = [];
        snapShot.docs.forEach((doc) => {
          messagesList.push(doc.data());
        });
        onMessageUpdates(messagesList);
      })
      .catch(() => {
        onMessageUpdates([]);
      });
  };

  // REQUEST METHODS
  getUserThread = async (userId: any, onComplete: any) => {
    firestore()
      .collection(PARTICIPATION_COLLECTION)
      .where("user", "==", userId)
      .get()
      .then((snapDoc) => {
        if (snapDoc.docs.length > 0) {
          var promiseList = [];
          this.threadList = [];
          for (let i = 0; i < snapDoc.docs.length; i++) {
            let snapObj = snapDoc.docs[i].data();
            let promise = new Promise((resolve, reject) => {
              firestore()
                .collection(CHANNEL_COLLECTION)
                .doc(snapObj["channel"])
                .get()
                .then((snapDoc) => {
                  let threadData = snapDoc.data();
                  firestore()
                    .collection(PARTICIPATION_COLLECTION)
                    .where("user", "!=", userId)
                    .where("channel", "==", snapObj["channel"])
                    .get()
                    .then((snapData) => {
                      let findedData = {
                        ...threadData,
                        participants: [snapData.docs[0].data(), snapObj],
                      };
                      this.threadList = [...this.threadList, findedData];
                      this.threadList.push(findedData);
                      resolve(true);
                    })
                    .catch((error) => {
                      reject(true);
                    });
                })
                .catch((error) => {
                  reject(error);
                });
            });
            promiseList.push(promise);
          }

          Promise.all(promiseList).finally(() => {
            this.updateStateList();
            onComplete(this.threadList);
          });
        } else {
          onComplete([]);
        }
      });
  };

  // send MESSAGES METHOD
  sendMessage = async (docId: any, data: any) => {
    return firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(docId)
      .collection(THREAD_COLLECITON)
      .doc(data.messageId)
      .set(data);
  };

  // SEND PUSH NOTIFICATION
  generatePushNotification = async (
    thread: any,
    sender: any,
    receiver: any,
    message: any
  ) => {
    let title = sender?.userName;
    const fcmToken = await fetchFCMTokenById(receiver?.user);
    if (fcmToken) {
      const pushNotificationBody = {
        message: {
          token: fcmToken,
          notification: {
            body: message,
            title: title,
          },
          data: {
            // type: NOTIFICATION_TYPES.chat,
            channelId: thread.channelID,
          },
        },
      };
      console.log("pushNotificationBody-------", pushNotificationBody);
      // const response: any = await sendPushNotificationReq(pushNotificationBody);
      // console.log("response------->", response);
    }
  };

  updateMessageSeener = (docId: any, messagesList: any, userId: any) => {
    let promiseList: any = [];
    messagesList.forEach((item: any) => {
      let promise = new Promise((resolve: any, reject) => {
        firestore()
          .collection(CHANNEL_COLLECTION)
          .doc(docId)
          .collection(THREAD_COLLECITON)
          .doc(item.messageId)
          .update({
            lastMessageSeeners: [userId],
          })
          .then(() => {
            resolve();
          })
          .catch(() => {
            reject();
          });
      });
      promiseList.push(promise);
    });
    Promise.all(promiseList).finally(() => {});
  };

  updateLastThreadMessage = (
    thread: any,
    lastMessage: any,
    otherUser: any,
    createAt: any,
    payload: any
  ) => {
    let data: any = {};
    if (payload?.messageId) {
      data["messageId"] = payload.messageId;
    }
    data["createdAt"] = createAt;
    data["lastMessage"] = lastMessage;
    if (otherUser) {
      data[`${otherUser.user}$$`] = 1;
      if (thread[`${otherUser.user}$$`]) {
        let count = thread[`${otherUser.user}$$`] + 1;
        thread[`${otherUser.user}$$`] = count;
        data[`${otherUser.user}$$`] = count;
      }
    }
    firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(thread.channelID)
      .update(data)
      .catch((err) => {});
  };

  // generate Id METHOD
  makeId = (length: any) => {
    var result = "";
    var characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  fetchMessageData = async (docId: any, messageId: any, onComplete: any) => {
    await firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(docId)
      .collection(THREAD_COLLECITON)
      .where("messageId", "==", messageId)
      .get()
      .then((snapDoc: any) => {
        if (snapDoc.docs.length > 0) {
          onComplete(snapDoc.docs[0]?._data?.lastMessageSeeners);
        }
      });
  };

  // IMAGE & videos upload
  uploadMedia = async (uri: any, videoType: boolean, onComplete: any) => {
    let filename = this.makeId(6) + uri.substring(uri.lastIndexOf("/") + 1);
    let uploadUri = Platform.OS === "ios" ? uri.replace("file://", "") : uri;

    if (videoType && uploadUri.includes("mov")) {
      let fileArr = filename.split(".");
      const ext = fileArr[fileArr.length - 1];
      if (ext.toLowerCase() == "mov") {
        filename = filename.replace(/mov/g, "mp4");
      }
    }
    const ref = storage().ref(filename);
    const task = ref.putFile(uploadUri);
    // set progress state
    task.on("state_changed", (snapshot) => {});
    try {
      await task
        .then((item) => {
          ref.getDownloadURL().then((url) => {
            onComplete(url);
          });
        })
        .catch((error) => {
          onComplete("error");
        });
    } catch (e) {
      onComplete("error");
    }
  };

  updateSpecificMessage = (threadId: string, data: any) => {
    return firestore()
      .collection(CHANNEL_COLLECTION)
      .doc(threadId)
      .collection(THREAD_COLLECITON)
      .doc(data.messageId)
      .update(data);
  };

  fetchLastThread = async (docId: string): Promise<any> => {
    try {
      const document = await firestore()
        .collection(CHANNEL_COLLECTION)
        .doc(docId)
        .get();

      if (document.exists) {
        const data = document.data();

        return data || null;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  };

  ////////////////////
}
export default ThreadManager;
