import React, { useEffect, useState } from "react";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  hv,
  normalized,
} from "../../../Utils/AppConstants";
import { useSelector } from "react-redux";
import { AppRootStore } from "../../../Redux/store/AppStore";
import AppStatusBar from "../SocialButton/AppStatusBar";
import FilledButton from "../CustomButton/FilledButton";

const CategorySelectionModal = (props: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;

  const [selectedCat, setSelectedCat] = useState<any>(null);
  const [selectedSubCat, setSelectedSubCat] = useState<any>([]);

  useEffect(() => {
    if (props?.selectedCategory) {
      setSelectedCat(props?.selectedCategory);
      setSelectedSubCat(props?.selectedSubCategory || []);
    }
  }, [props?.selectedCategory, props?.selectedSubCategory]);

  return (
    <Modal animationType="fade" visible={true} transparent={true}>
      <AppStatusBar
        backgroundColor={
          props.indigo ? "rgba(13, 13, 46,0.92)" : "rgba(0,0,0,0.3)"
        }
        barStyle={"light-content"}
      />

      <View style={styles.container}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: normalized(selector?.isNotchBar ? 70 : 40),
          }}
        >
          <Text
            style={{
              ...styles.title,
            }}
          >
            Filter Products
          </Text>
          <TouchableOpacity
            style={{
              ...styles.closeButton,
            }}
            activeOpacity={0.7}
            onPress={() => {
              props?.onClose();
            }}
          >
            <Image source={AppImages.Home.close} style={styles.closeIcon} />
          </TouchableOpacity>
        </View>

        <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
          <Text style={styles.titleTxt}>Main Category</Text>
          <View style={styles.listCont}>
            {selectedCat?.title ? (
              <TouchableOpacity
                activeOpacity={1}
                onPress={() => {
                  setSelectedCat(null);
                }}
              >
                <View style={[styles.listsubCont, styles.selectedBackground]}>
                  <Text style={[styles.listTxt, styles.selectedText]}>
                    {selectedCat?.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ) : (
              <>
                {selector?.productCategoryList?.length > 0 &&
                  selector?.productCategoryList.map((el: any, index: any) => {
                    const isSelected = selectedCat?.category == el?.category;

                    return (
                      <TouchableOpacity
                        key={index}
                        activeOpacity={1}
                        onPress={() => {
                          setSelectedCat(el);
                          setSelectedSubCat([]);
                        }}
                      >
                        <View
                          style={[
                            styles.listsubCont,
                            isSelected
                              ? styles.selectedBackground
                              : styles.defaultBackground,
                          ]}
                        >
                          <Text
                            style={[
                              styles.listTxt,
                              isSelected
                                ? styles.selectedText
                                : styles.defaultText,
                            ]}
                          >
                            {el?.category}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
              </>
            )}
          </View>

          {selectedCat?.category && (
            <>
              <Text style={styles.titleTxt}>Sub Categories</Text>
              <View style={styles.listCont}>
                <>
                  {selectedCat?.subCat?.length > 0 &&
                    selectedCat?.subCat.map((el: any, index: any) => {
                      const isSelected = selectedSubCat.includes(el?.name);

                      return (
                        <TouchableOpacity
                          key={el?.id || index} // Using el.id for unique key
                          activeOpacity={1}
                          onPress={() => {
                            let updatedList = [...selectedSubCat];

                            if (isSelected) {
                              // Remove if already selected
                              updatedList = updatedList.filter(
                                (singleCategory: any) =>
                                  singleCategory !== el?.name
                              );
                            } else {
                              updatedList.push(el?.name);
                            }

                            setSelectedSubCat(updatedList);
                          }}
                        >
                          <View
                            style={[
                              styles.listsubCont,
                              isSelected
                                ? styles.selectedBackground
                                : styles.defaultBackground,
                            ]}
                          >
                            <Text
                              style={[
                                styles.listTxt,
                                isSelected
                                  ? styles.selectedText
                                  : styles.defaultText,
                              ]}
                            >
                              {el?.name}{" "}
                              {/* Changed from el?.title to el?.name */}
                            </Text>
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                </>
              </View>
            </>
          )}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TouchableOpacity
            activeOpacity={1}
            onPress={() => {
              setSelectedCat(null);
              setSelectedSubCat([]);
              props?.atClear();
            }}
            style={styles.clearBtnCont}
          >
            <Text
              style={{
                fontSize: normalized(14),
                color: AppColors.themeColor.dark,
              }}
            >
              Clear
            </Text>
          </TouchableOpacity>
          <FilledButton
            label={"Apply"}
            onPress={() => {
              props?.atApply(selectedCat, selectedSubCat);
            }}
            mainContainer={styles.applyButtonContainer}
          />
        </View>
      </View>
    </Modal>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AppColors.white.white,
    paddingHorizontal: AppHorizontalMargin,
  },
  closeButton: {
    height: normalized(35),
    width: normalized(35),
    borderRadius: normalized(35 / 2),
    justifyContent: "center",
  },
  closeIcon: {
    height: normalized(20),
    width: normalized(20),
  },
  title: {
    fontSize: normalized(20),
    fontFamily: AppFonts.OpenSansMedium,
    color: AppColors.black.black,
  },
  listCont: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  listsubCont: {
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    marginRight: normalized(10),
    borderRadius: normalized(25),
    marginTop: normalized(15),
  },
  listTxt: {
    paddingHorizontal: normalized(15),
    paddingVertical: normalized(8),
    fontFamily: AppFonts.PoppinsRegular,
  },
  selectedBackground: {
    backgroundColor: AppColors.themeColor.dark,
  },
  defaultBackground: {
    backgroundColor: AppColors.white.white,
  },
  selectedText: {
    color: AppColors.white.white,
  },
  defaultText: {
    color: AppColors.themeColor.dark,
  },
  applyButtonContainer: {
    width: normalized(160),
    marginBottom: hv(25),
    alignSelf: "center",
  },
  titleTxt: {
    marginTop: AppHorizontalMargin,
    textDecorationColor: AppColors.grey.greyLevel9,
    textDecorationLine: "underline",
    textDecorationStyle: "solid",
    fontSize: normalized(14),
    fontFamily: AppFonts.PoppinsMedium,
  },
  clearBtnCont: {
    width: normalized(130),
    height: normalized(45),
    borderRadius: normalized(30),
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CategorySelectionModal;
