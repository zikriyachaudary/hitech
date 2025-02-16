import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import {
  AppColors,
  AppFonts,
  AppHorizontalMargin,
  AppImages,
  Categories,
  fullDate,
  hv,
  normalized,
  ScreenProps,
} from "../../../../Utils/AppConstants";
import ImageViewModal from "../../../Components/CustomModal/ImageViewModal";
import { AppStyles } from "../../../../Utils/AppStyles";
import CustomHeader from "../../../Components/CustomHeader/CustomHeader";
import CustomInput from "../../../Components/CustomInput/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { AppRootStore } from "../../../../Redux/store/AppStore";
import CustomDropDown from "../Components/CustomDropDown";
import AppImagePicker from "../../../Components/CustomModal/AppImagePicker";
import AppImageViewer from "../../../Components/AppImageView";
import FilledButton from "../../../Components/CustomButton/FilledButton";
import {
  fetchCatListReq,
  uploadMedia,
} from "../../../../Network/Services/GeneralServices";
import {
  setIsLoader,
  setShowToast,
} from "../../../../Redux/Reducers/AppReducers";
import { AppStrings } from "../../../../Utils/AppStrings";
import CommonDataManager from "../../../../Utils/CommonManager";
import {
  deleteProductReq,
  updateProduct,
  uploadProductToFireStore,
} from "../../../../Network/Services/ProductServices";
import moment from "moment";

const AddProducScreen = (props: ScreenProps) => {
  const productDetail = props?.route?.params?.item;
  const [openImage, setOpenImage] = useState<Boolean>(false);
  const [imageList, setImageList] = useState<any>(productDetail?.images ?? []);

  const [productMainCat, setProductMainCat] = useState<any>(
    productDetail?.category || null
  );
  const [categoryList, setCategoryList] = useState<any>([]);
  const [selectedCat, setSelectedCat] = useState<any>(
    productDetail?.category || ""
  );
  const [subCatList, setSubCatList] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState<any>(
    productDetail?.subCat || ""
  );
  console.log("productDetail ---- ", productDetail?.subCat?.name);

  const [productSubCat, setProductSubCat] = useState<any>(
    productDetail?.subCategory || null
  );

  const [imageView, setImageView] = useState({
    initialIndex: 0,
    imagesList: [],
    value: false,
  });

  const productNameRef = useRef();
  const productPriceRef = useRef();
  const descriptionRef = useRef();

  const [productName, setProductName] = useState<string>(
    productDetail?.name ?? ""
  );
  const [productPrice, setProductPrice] = useState<any>(
    productDetail?.price ?? ""
  );

  const [description, setDescription] = useState<string>(
    productDetail?.description ?? ""
  );

  const { isNetConnected, userData } = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );

  ///error------->
  const [productNameError, setProductNameError] = useState("");
  const [productPriceError, setProductPriceError] = useState("");
  const [productDesError, setProductDesError] = useState("");
  const [productImagesError, setProductImagesError] = useState("");
  const [catError, setCatError] = useState("");
  const [catSubError, setCatSubError] = useState("");

  const dispatch = useDispatch();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    try {
      if (categoryList?.length == 0) dispatch(setIsLoader(true));
      fetchCatListReq((resp: any) => {
        if (resp?.status) {
          setCategoryList(resp?.data);
          if (productDetail != null) {
            const matchedCategory = resp?.data?.find(
              (item: any) => item.category === productDetail?.category?.category
            );
            console.log("-----", matchedCategory);

            if (matchedCategory) {
              setSubCatList(matchedCategory.subCat);
            } else {
              setSubCatList([]); // Or handle the case where no match is found
            }
          }
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message: resp?.message,
            })
          );
        }
        dispatch(setIsLoader(false));
      });
    } catch (error) {
      console.log("error --->>>  ", error);
    }
  };

  const removeImage = (index: number) => {
    setImageList((prevImageList: any) =>
      prevImageList.filter((_: any, i: number) => i !== index)
    );
  };

  const renderImageItem = ({ item, index }: { item: any; index: number }) => (
    <View style={styles.imageContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => {
          let imagesArr: any = [];
          for (let i = 0; i < imageList.length; i++) {
            const element = imageList[i];
            let url = element?.url ?? element;
            imagesArr.push({
              url: url,
            });
          }
          setImageView({
            initialIndex: index,
            imagesList: imagesArr,
            value: true,
          });
        }}
      >
        <AppImageViewer
          resizeMode={"cover"}
          source={{ uri: item?.url ?? item }}
          style={styles.image}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => removeImage(index)}
        style={styles.crossContainer}
      >
        <Image source={AppImages.Home.close} style={styles.crossIcon} />
      </TouchableOpacity>
    </View>
  );

  const onAddProduct = async () => {
    let isFormValid = true;
    if (imageList?.length == 0) {
      setProductImagesError("Attach Product Pictures");
    }
    if (!productName) {
      setProductNameError("* Required");
      isFormValid = false;
    }
    if (!productPrice) {
      setProductPriceError("* Required");
      isFormValid = false;
    }
    if (!description) {
      setProductDesError("* Required");
      isFormValid = false;
    }
    if (!selectedCat?.category) {
      setCatError("* Required");
      isFormValid = false;
    }
    if (selectedCat?.category && !selectedSubCat?.name) {
      setCatSubError("* Required");
      isFormValid = false;
    }

    const obj = {
      name: productName,
      id: productDetail?.id
        ? productDetail?.id
        : CommonDataManager.getSharedInstance()?.makeid(8),
      price: productPrice,
      description: description,
      createdAt: moment.utc(new Date()).format(fullDate),
      category: {
        category: selectedCat?.category,
        id: selectedCat?.id,
      },
      subCat: {
        name: selectedSubCat?.name,
        id: selectedSubCat?.id,
      },
      images: [],
    };
    let productImagesList: any = [];
    dispatch(setIsLoader(true));
    const uploadTasks = imageList.map((el: any) => {
      if (!el?.url) {
        return new Promise((resolve: any) => {
          uploadMedia(el, (url: any) => {
            productImagesList.push({
              imageId: CommonDataManager.getSharedInstance().makeid(4),
              url,
            });
            resolve();
          });
        });
      } else {
        productImagesList.push(el);
        return Promise.resolve();
      }
    });
    await Promise.all(uploadTasks);
    obj["images"] = productImagesList;
    console.log("productImagesList -----  ", productImagesList);
    console.log("upload product --->>>", obj);

    if (productDetail?.id) {
      dispatch(setIsLoader(true));
      await updateProduct(obj, (resp: any) => {
        if (resp?.status) {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: "Product Updated Successfully",
            })
          );
          props?.navigation?.goBack();
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message: AppStrings.Network.someThingError,
            })
          );
        }
      });
      dispatch(setIsLoader(false));
    } else {
      await uploadProductToFireStore(obj, (resp: any) => {
        if (resp?.status) {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: "Product Added Successfully",
            })
          );
          props?.navigation?.goBack();
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message: AppStrings.Network.someThingError,
            })
          );
        }
      });
      dispatch(setIsLoader(false));
    }
  };

  const deleteProduct = async () => {
    try {
      await deleteProductReq(productDetail?.id, (resp: any) => {
        dispatch(setIsLoader(true));
        if (resp?.status) {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.success,
              message: resp?.message,
            })
          );
          props?.navigation?.goBack();
        } else {
          dispatch(
            setShowToast({
              type: AppStrings.ToastType.error,
              message: resp?.message,
            })
          );
        }
        dispatch(setIsLoader(false));
      });
    } catch (error) {
      console.log("error --->  ", error);
      dispatch(setIsLoader(false));
    }
  };

  return (
    <View style={AppStyles.MainStyle}>
      <SafeAreaView />
      <CustomHeader
        title={productDetail ? "Update Product" : "Add Product"}
        onPress={() => props?.navigation?.goBack()}
        {...(productDetail && {
          icon: [AppImages.Products.delete],
          onRightIconPress: () => deleteProduct(),
        })}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={5}
      >
        <ScrollView
          style={{ flex: 1, paddingHorizontal: AppHorizontalMargin }}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.Container}>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{"Product Name"}</Text>
              <CustomInput
                placeHold={"Enter Product Name"}
                placeHolderColor={AppColors.grey.greyLevel4}
                container={styles.inputContainer}
                ref={productNameRef}
                onSubmitEditing={() => focusNextField(productPriceRef)}
                setValue={(txt: any) => {
                  setProductName(txt);
                  setProductNameError("");
                }}
                value={productName}
                errorMsg={productNameError}
              />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>{"Price"}</Text>
              <CustomInput
                placeHold={"Amount"}
                placeHolderColor={AppColors.grey.greyLevel4}
                container={styles.inputContainer}
                ref={productPriceRef}
                keyboardType="numeric"
                onSubmitEditing={() => focusNextField(descriptionRef)}
                setValue={(txt: any) => {
                  const numeric = txt.replace(/[^\d.]+|(?<=\..*)\./g, "");
                  setProductPrice(numeric);
                  setProductPriceError("");
                }}
                value={productPrice}
                errorMsg={productPriceError}
              />
            </View>
          </View>

          <Text style={styles.label}>Description</Text>
          <CustomInput
            isMultiLine={true}
            placeHold={"Detail About Product"}
            placeHolderColor={AppColors.grey.greyLevel4}
            container={{
              ...styles.inputContainer,
              height: hv(100),
            }}
            ref={descriptionRef}
            onFocus={true}
            setValue={(txt: any) => {
              setDescription(txt);
              setProductDesError("");
            }}
            value={description}
            maxLength={320}
            errorMsg={productDesError}
          />

          <Text style={{ ...styles.label, marginBottom: normalized(7) }}>
            Product Category
          </Text>
          <CustomDropDown
            isError={catError?.length > 0}
            placeHolder={"Select product category"}
            atSelect={(val: any) => {
              setCatError("");
              setSelectedCat(val);
              setSubCatList(val?.subCat);
              setSelectedSubCat("");
            }}
            selected={selectedCat?.category}
            optionKey={"category"}
            list={categoryList}
          />
          {catError && <Text style={styles.errorMsg}>{catError}</Text>}
          {subCatList?.length > 0 && (
            <>
              <Text style={{ ...styles.label, marginBottom: 5 }}>
                {"Product Sub Category"}
              </Text>
              <CustomDropDown
                isError={catSubError?.length > 0}
                placeHolder={"Select product sub category"}
                atSelect={(val: any) => {
                  setCatSubError("");
                  setSelectedSubCat(val);
                }}
                selected={selectedSubCat?.name}
                optionKey={"name"}
                list={subCatList}
              />
              {catSubError && (
                <Text style={styles.errorMsg}>{catSubError}</Text>
              )}
            </>
          )}

          <Text style={styles.label}>Attach Product Images</Text>
          <View style={styles.imgWrapper}>
            {imageList.length > 0 && (
              <View>
                <FlatList
                  data={imageList}
                  horizontal
                  renderItem={renderImageItem}
                  keyExtractor={(item, index) => index.toString()}
                  contentContainerStyle={styles.flatListContainer}
                />
              </View>
            )}

            {imageList.length < 4 && (
              <TouchableOpacity
                style={styles.plusCont}
                onPress={() => {
                  setOpenImage(true);
                  setProductImagesError("");
                }}
              >
                <Image
                  source={AppImages.Home.PlusBlack}
                  style={styles.plusImg}
                />
              </TouchableOpacity>
            )}
          </View>
          {productImagesError && (
            <Text style={styles.errorMsg}>{productImagesError}</Text>
          )}
        </ScrollView>
      </KeyboardAvoidingView>

      <FilledButton
        mainCustomStyle={{ marginBottom: hv(15) }}
        label={productDetail ? "Update" : "Publish"}
        onPress={() => {
          onAddProduct();
        }}
      />

      {openImage ? (
        <AppImagePicker
          limit={10}
          onClose={() => {
            setOpenImage(false);
          }}
          onImageSelect={(userSelectedImages: any) => {
            setOpenImage(false);
            if (userSelectedImages) {
              let imagesArr = [...imageList];
              if (Array.isArray(userSelectedImages)) {
                imagesArr = [...imagesArr, ...userSelectedImages];
              } else {
                imagesArr.push(userSelectedImages);
              }
              setImageList(
                imagesArr?.length > 4 ? imagesArr.slice(0, 4) : imagesArr
              );
            }
          }}
        />
      ) : null}
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
    </View>
  );
};

export default AddProducScreen;

const styles = StyleSheet.create({
  Container: {
    flexDirection: "row",
    gap: normalized(10),
  },
  inputContainer: {
    flexDirection: "row",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: normalized(7),
    height: normalized(43),
    alignItems: "center",
    borderColor: AppColors.grey.greyLevel6,
    paddingLeft: normalized(5),
    marginTop: normalized(5),
  },
  label: {
    marginTop: normalized(10),
    color: AppColors.black.black,
    fontSize: normalized(12),
    fontFamily: AppFonts.PoppinsMedium,
  },

  plusImg: {
    width: normalized(15),
    height: normalized(15),
    resizeMode: "contain",
    tintColor: AppColors.themeColor.dark,
  },
  plusCont: {
    borderColor: AppColors.themeColor.dark,
    borderWidth: 1,
    width: normalized(40),
    height: normalized(40),
    alignItems: "center",
    justifyContent: "center",
    borderRadius: normalized(40 / 2),
  },

  flatListContainer: {
    alignItems: "center",
  },
  imageContainer: {
    margin: 10,
  },
  crossContainer: {
    position: "absolute",
    right: -10,
    height: normalized(20),
    width: normalized(20),
    borderRadius: normalized(20 / 2),
    justifyContent: "center",
    alignItems: "center",
    top: -10,
    backgroundColor: AppColors.red.dark,
    zIndex: 10,
  },
  image: {
    width: normalized(62),
    height: normalized(54),
    resizeMode: "cover",
    borderRadius: normalized(4),
  },
  crossIcon: {
    width: normalized(8),
    height: normalized(10),
    resizeMode: "contain",
    tintColor: AppColors.white.white,
  },
  imgWrapper: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    paddingVertical: 10,
  },
  errorMsg: {
    color: "red",
    fontSize: normalized(12),
    marginLeft: normalized(2),
  },
  catInnerCont: {
    backgroundColor: AppColors.themeColor.dark,
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    justifyContent: "center",
    alignItems: "center",
    height: normalized(30),
    maxWidth: normalized(180),
    borderRadius: normalized(30 / 2),
  },
  catCont: {
    flex: 1,
    height: normalized(45),
    borderWidth: 1,
    borderColor: AppColors.grey.greyLevel2,
    marginVertical: 10,
    paddingHorizontal: normalized(15),
    borderRadius: normalized(10),
    justifyContent: "center",
  },
});
