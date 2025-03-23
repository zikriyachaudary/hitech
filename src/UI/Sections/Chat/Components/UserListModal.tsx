import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import {
  AppColors,
  AppImages,
  hv,
  normalized,
  ScreenSize,
} from "../../../../Utils/AppConstants";
import AppStatusBar from "../../../Components/SocialButton/AppStatusBar";
import AppImageViewer from "../../../Components/AppImageView";
import { getUserCompleteListReq } from "../../../../Network/Services/GeneralServices";

const UserListModal = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const [users, setUsers] = useState<any>([]);
  const [lastDoc, setLastDoc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = useCallback(() => {
    if (loading || !hasMore) return;
    setLoading(true);
    getUserCompleteListReq(
      (newUsers, newLastDoc) => {
        console.log("newUsers ---  ", newUsers);

        setUsers((prevUsers: any) => [...prevUsers, ...newUsers]);
        setLastDoc(newLastDoc);
        setHasMore(newUsers.length > 0);
        setLoading(false);
      },
      lastDoc,
      10
    );
  }, [lastDoc, loading, hasMore]);

  const renderFooter = () => {
    if (!loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE",
        }}
      >
        <ActivityIndicator
          animating
          size="small"
          color={AppColors.themeColor.dark}
        />
      </View>
    );
  };

  return (
    <Modal animationType={"slide"} visible={true} transparent={true}>
      <AppStatusBar
        backgroundColor={"rgba(0,0,0,0.3)"}
        barStyle={"light-content"}
      />

      <View style={styles.container}>
        <View style={styles.alertBox}>
          <Text
            style={{
              ...styles.title,
              color: AppColors.black.black,
            }}
          >
            {"User List"}
          </Text>
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              props?.onClose();
            }}
            style={styles.closeBtnCont}
          >
            <Image source={AppImages.Home.close} style={styles.closeIcon} />
          </TouchableOpacity>

          <FlatList
            style={{
              flex: 1,
            }}
            showsVerticalScrollIndicator={false}
            data={users}
            renderItem={({ item, index }: any) => {
              if (item?.userId == selector?.userData?.userId) return null;
              return (
                <>
                  <View style={styles.singleItemCont}>
                    <View style={styles.innerCont}>
                      <AppImageViewer
                        source={{ uri: item?.profileImage }}
                        style={styles.profileImg}
                      />
                      <Text
                        numberOfLines={1}
                        style={{
                          fontSize: normalized(14),
                          paddingStart: normalized(10),
                        }}
                      >
                        {item?.fullName}
                      </Text>
                    </View>
                    <View style={styles.innerCont}>
                      <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => {
                          props?.atChatPress(item);
                        }}
                        style={{
                          padding: normalized(10),
                        }}
                      >
                        <Image
                          source={AppImages.Chat.chat}
                          style={styles.chatIcon}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{ padding: normalized(10) }}
                        activeOpacity={1}
                        onPress={() => {
                          props?.atCallPress(item);
                        }}
                      >
                        <Image
                          source={AppImages.Chat.phone}
                          style={styles.chatIcon}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                  {index !== users?.length - 1 && <View style={styles.line} />}
                </>
              );
            }}
            keyExtractor={(index) => `${index}`}
            ListFooterComponent={renderFooter}
            onEndReached={fetchUsers}
            onEndReachedThreshold={0.5}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "center",
    justifyContent: "center",
  },
  alertBox: {
    marginHorizontal: normalized(20),
    backgroundColor: AppColors.white.white,
    borderRadius: 20,
    padding: normalized(15),
    height: normalized(300),
    width: ScreenSize.width - normalized(40),
  },
  profileImg: {
    height: normalized(40),
    width: normalized(40),
    borderRadius: normalized(40 / 2),
    borderWidth: 1,
    borderColor: AppColors.themeColor.light,
  },
  title: {
    fontSize: normalized(16),
    color: AppColors.black.black,
    fontWeight: "500",
    marginVertical: hv(12),
    alignSelf: "center",
  },
  closeBtnCont: {
    height: normalized(30),
    width: normalized(30),
    borderRadius: normalized(30 / 2),
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: AppColors.black.black,
    position: "absolute",
    zIndex: 1,
    right: normalized(15),
    top: normalized(20),
  },
  closeIcon: {
    height: normalized(15),
    width: normalized(15),
    tintColor: AppColors.black.black,
  },
  singleItemCont: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: normalized(3),
  },
  innerCont: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
  },
  chatIcon: {
    height: normalized(20),
    width: normalized(20),
  },
  line: {
    height: 0.5,
    backgroundColor: AppColors.grey.greyLevel10,
    marginVertical: normalized(10),
  },
});

export default UserListModal;
