import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isRtl = selector?.isRtl;
  const productDetail = props?.route?.params?.item;
  const [openImage, setOpenImage] = useState<Boolean>(false);
  const [imageList, setImageList] = useState<any>(productDetail?.images ?? []);
  const [categoryList, setCategoryList] = useState<any>([]);
  const [selectedCat, setSelectedCat] = useState<any>(
    productDetail?.category || ""
  );
  const [subCatList, setSubCatList] = useState([]);
  const [selectedSubCat, setSelectedSubCat] = useState<any>(
    productDetail?.subCat || ""
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
  const [isChecked, setIsChecked] = useState(false);
  const [errors, setErrors] = useState<any>({});

  ///// urdu ----->>>

  const [rtlCategoryList, setRtlCategoryList] = useState<any>([]);
  const [rtlSelectedCat, setRtlSelectedCat] = useState<any>(
    productDetail?.rtlCategory || ""
  );
  const [rtlSubCatList, setRtlSubCatList] = useState([]);
  const [rtlSelectedSubCat, setRtlSelectedSubCat] = useState<any>(
    productDetail?.rtlSubCat || ""
  );
  const rtlProductNameRef = useRef();
  const [rtlProductName, setRtlProductName] = useState<string>(
    productDetail?.rtlName ?? ""
  );
  const [rtlDescription, setRtlDescription] = useState<string>(
    productDetail?.rtlDescription ?? ""
  );
  const [numSizes, setNumSizes] = useState("");
  const [sizes, setSizes] = useState<any>([]);

  ///error------->
  const [productNameError, setProductNameError] = useState("");
  const [productPriceError, setProductPriceError] = useState("");
  const [productDesError, setProductDesError] = useState("");
  const [productImagesError, setProductImagesError] = useState("");
  const [catError, setCatError] = useState("");
  const [catSubError, setCatSubError] = useState("");
  //////-----> urdu errors
  const [rtlProductNameError, setRtlProductNameError] = useState("");
  const [rtlProductDesError, setRtlProductDesError] = useState("");
  const [rtlCatError, setRtlCatError] = useState("");
  const [rtlCatSubError, setRtlCatSubError] = useState<any>("");
  const [checkError, setCheckError] = useState<any>("");
  const [numSizeError, setNumSizeError] = useState("");

  const dispatch = useDispatch();

  const focusNextField = (inputRef: any) => {
    if (inputRef?.current) {
      inputRef?.current?.focus();
    }
  };

  const handleNumSizesChange = (txt: any) => {
    const numericValue = txt.replace(/[^\d]/g, "");
    setNumSizes(numericValue);

    const sizeCount = Number(numericValue) || 0;
    setSizes(
      new Array(sizeCount).fill({ price: "", size: "", goldenPrice: "" })
    );
    setErrors({});
  };

  const handleSizeChange = (index: any, key: any, value: any) => {
    const updatedSizes = [...sizes];
    updatedSizes[index] = { ...updatedSizes[index], [key]: value };
    setSizes(updatedSizes);

    setErrors((prevErrors: any) => {
      const newErrors: any = { ...prevErrors };
      if (value.trim() === "") {
        newErrors[`${key}-${index}`] = "* Required";
      } else {
        delete newErrors[`${key}-${index}`];
      }
      return newErrors;
    });
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
          setRtlCategoryList(resp?.data);
          if (productDetail != null) {
            const matchedCategory = resp?.data?.find(
              (item: any) => item.category === productDetail?.category?.category
            );

            if (matchedCategory) {
              setSubCatList(matchedCategory.subCat);
              setRtlSubCatList(matchedCategory?.rtlSubCat);
            } else {
              setSubCatList([]);
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

  const onAddProduct = async () => {
    let isFormValid = true;
    let newErrors: any = {};

    if (imageList?.length == 0) {
      setProductImagesError(
        isRtl ? "مصنوعات کی تصاویر منسلک کریں" : "Attach Product Pictures"
      );
    }
    if (!productName) {
      setProductNameError("* Required");
      isFormValid = false;
    }
    if (isChecked) {
      sizes.forEach((item: any, index: any) => {
        if (!item.price) {
          newErrors[`price-${index}`] = isRtl ? "* لازمی" : "* Required";
          isFormValid = false;
        }
        if (!item.size) {
          newErrors[`size-${index}`] = isRtl ? "* لازمی" : "* Required";
          isFormValid = false;
        }
        if (!item.goldenPrice) {
          newErrors[`goldenPrice-${index}`] = isRtl ? "* لازمی" : "* Required";
          isFormValid = false;
        }
      });
      if (numSizes == "") {
        setNumSizeError(isRtl ? "* لازمی" : "* Required");
      }
    } else {
      if (!productPrice) {
        newErrors["productPrice"] = isRtl ? "* لازمی" : "* Required";
        isFormValid = false;
      }
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

    if (!rtlProductName) {
      setRtlProductNameError("* لازمی");
      isFormValid = false;
    }
    if (!rtlDescription) {
      setRtlProductDesError("* لازمی");
      isFormValid = false;
    }
    if (!rtlSelectedCat?.rtlCategory && !rtlSelectedCat?.category) {
      console.log("here is console ----");
      setRtlCatError("* لازمی");
      isFormValid = false;
    }

    if (rtlSelectedCat?.category && !rtlSelectedSubCat?.name) {
      setRtlCatSubError("* لازمی");
      isFormValid = false;
    }
    if (imageList?.length == 0) {
      setProductImagesError(
        isRtl
          ? "براہ کرم پروڈکٹ کی تصاویر منسلک کریں"
          : "Please Attach Product Images"
      );
      isFormValid = false;
    }

    if (!isFormValid) {
      setErrors(newErrors);
      return;
    }
    const obj = {
      name: productName,
      id: productDetail?.id
        ? productDetail?.id
        : CommonDataManager.getSharedInstance()?.makeid(8),
      price: productPrice,
      description: description,
      createdAt: productDetail?.createdAt
        ? productDetail?.createdAt
        : moment.utc(new Date()).format(fullDate),
      category: {
        category: selectedCat?.category,
        id: selectedCat?.id,
      },
      subCat: {
        name: selectedSubCat?.name,
        id: selectedSubCat?.id,
      },
      images: [],
      rtlName: rtlProductName,
      rtlDescription: rtlDescription,
      rtlCategory: {
        category: rtlSelectedCat?.rtlCategory || rtlSelectedCat?.category,
        id: rtlSelectedCat?.id,
      },
      rtlSubCat: {
        name: rtlSelectedSubCat?.name,
        id: rtlSelectedSubCat?.id,
      },
      isMultipleSizes: isChecked,
      sizeNPrice: sizes,
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
        title={
          isRtl
            ? productDetail
              ? "پروڈکٹ کو اپ ڈیٹ کریں"
              : "پروڈکٹ شامل کریں"
            : productDetail
            ? "Update Product"
            : "Add Product"
        }
        onPress={() => props?.navigation?.goBack()}
        rightIconCont={{
          width: normalized(33),
          height: normalized(33),
          borderColor: AppColors.red.dark,
          borderRadius: normalized(40),
          borderWidth: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: AppColors.white.white,
        }}
        rightIconStyle={{
          width: normalized(20),
          height: normalized(20),
          tintColor: AppColors.red.dark,
        }}
        {...(productDetail && {
          icon: [AppImages.Products.delete],
          onRightIconPress: () => deleteProduct(),
        })}
      />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? hv(35) : hv(10)}
      >
        <ScrollView
          style={{ flex: 1, paddingHorizontal: AppHorizontalMargin }}
          showsVerticalScrollIndicator={false}
        >
          {/* <View style={styles.Container}> */}
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

          <View
            style={{
              ...styles.checkMainCont,
              flexDirection: "row",
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => {
                setIsChecked(!isChecked);
                setCheckError("");
                LayoutAnimation.configureNext(
                  LayoutAnimation.Presets.easeInEaseOut
                );
              }}
            >
              <View
                style={{
                  ...styles.checkCont,
                  borderColor: AppColors.themeColor.dark,
                  backgroundColor: checkError
                    ? AppColors.red.pink
                    : AppColors.white.white,
                }}
              >
                {isChecked && (
                  <Image
                    source={AppImages.Home.tick}
                    resizeMode="contain"
                    style={{
                      height: normalized(12),
                      width: normalized(12),
                    }}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
            <Text style={styles.checkTxt}>Multiple Sizes</Text>
            {isChecked && (
              <CustomInput
                container={{ width: normalized(140) }}
                placeHold={"No. of Sizes"}
                placeHolderColor={AppColors.grey.greyLevel4}
                ref={productPriceRef}
                keyboardType="numeric"
                onSubmitEditing={() => {}}
                setValue={(txt: any) => {
                  handleNumSizesChange(txt);
                  LayoutAnimation.configureNext(
                    LayoutAnimation.Presets.easeInEaseOut
                  );
                }}
                value={numSizes}
                errorMsg={numSizeError}
              />
            )}
          </View>

          {/*----------------------- Multiple Sizes Price here ----------------------- */}
          {isChecked &&
            sizes.length > 0 &&
            sizes.map((item: any, index: any) => (
              <View
                key={index}
                style={{
                  borderWidth: 1,
                  borderColor: AppColors.themeColor.dark,
                  borderRadius: normalized(10),
                  paddingHorizontal: normalized(10),
                  marginTop: normalized(10),
                  paddingBottom: normalized(10),
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    gap: normalized(10),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{isRtl ? "قیمت" : "Price"}</Text>
                    <CustomInput
                      placeHold={isRtl ? "قیمت" : "Amount"}
                      placeHolderColor={AppColors.grey.greyLevel4}
                      container={styles.inputContainer}
                      keyboardType="numeric"
                      onSubmitEditing={() => {}}
                      setValue={(txt: any) =>
                        handleSizeChange(index, "price", txt)
                      }
                      value={item.price}
                      errorMsg={errors[`price-${index}`] || ""}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>{isRtl ? "سائز" : "Size"}</Text>
                    <CustomInput
                      placeHold={"Size"}
                      placeHolderColor={AppColors.grey.greyLevel4}
                      container={styles.inputContainer}
                      onSubmitEditing={() => {}}
                      setValue={(txt: any) =>
                        handleSizeChange(index, "size", txt)
                      }
                      value={item.size}
                      errorMsg={errors[`size-${index}`] || ""}
                    />
                  </View>
                </View>
                <View style={{ flex: 1, marginTop: 10 }}>
                  <Text style={styles.label}>Price for Golden Customers</Text>
                  <CustomInput
                    placeHold={"Amount"}
                    placeHolderColor={AppColors.grey.greyLevel4}
                    container={styles.inputContainer}
                    keyboardType="numeric"
                    onSubmitEditing={() => {}}
                    setValue={(txt: any) =>
                      handleSizeChange(index, "goldenPrice", txt)
                    }
                    value={item.goldenPrice}
                    errorMsg={errors[`goldenPrice-${index}`] || ""}
                  />
                </View>
              </View>
            ))}

          {!isChecked && (
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={styles.label}>{"Price"}</Text>
                <Text style={styles.label}>{"قیمت"}</Text>
              </View>
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
          )}

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
          <Text style={{ ...styles.label, alignSelf: "center" }}>
            --------- اردو میں معلومات ------------
          </Text>

          <View style={{ flex: 1 }}>
            <Text style={{ ...styles.label, alignSelf: "flex-end" }}>
              {"مصنوعات کانام"}
            </Text>
            <CustomInput
              isRtl={true}
              placeHold={"مصنوعات کا نام درج کریں"}
              placeHolderColor={AppColors.grey.greyLevel4}
              container={styles.inputContainer}
              ref={rtlProductNameRef}
              onSubmitEditing={() => focusNextField(productPriceRef)}
              setValue={(txt: any) => {
                setRtlProductName(txt);
                setRtlProductNameError("");
              }}
              value={rtlProductName}
              errorMsg={rtlProductNameError}
            />
          </View>
          <Text style={{ ...styles.label, alignSelf: "flex-end" }}>تفصیل</Text>
          <CustomInput
            isRtl={true}
            isMultiLine={true}
            placeHold={"مصنوعات کی تفصیل درج کریں"}
            placeHolderColor={AppColors.grey.greyLevel4}
            container={{
              ...styles.inputContainer,
              height: hv(100),
            }}
            ref={descriptionRef}
            onFocus={true}
            setValue={(txt: any) => {
              setRtlDescription(txt);
              setRtlProductDesError("");
            }}
            value={rtlDescription}
            maxLength={320}
            errorMsg={rtlProductDesError}
          />

          <Text
            style={{
              ...styles.label,
              marginBottom: normalized(7),
              alignSelf: "flex-end",
            }}
          >
            پروڈکٹ کیٹگری
          </Text>
          <CustomDropDown
            isError={catError?.length > 0}
            placeHolder={"پروڈکٹ کیٹیگری کا انتخاب کریں"}
            atSelect={(val: any) => {
              console.log(" --0----->>  ", val);

              setRtlCatError("");
              setRtlSelectedCat(val);
              setRtlSubCatList(val?.rtlSubCat);
              setRtlSelectedSubCat("");
            }}
            selected={rtlSelectedCat?.rtlCategory || rtlSelectedCat?.category}
            optionKey={"rtlCategory"}
            list={rtlCategoryList}
          />
          {catError && <Text style={styles.errorMsg}>{rtlCatError}</Text>}
          {(rtlSubCatList?.length > 0 || rtlSelectedCat) && (
            <>
              <Text
                style={{
                  ...styles.label,
                  marginBottom: 5,
                  alignSelf: "flex-end",
                }}
              >
                {"پروڈکت سبکیٹگری"}
              </Text>
              <CustomDropDown
                isError={catSubError?.length > 0}
                placeHolder={"پروڈکٹ سبکیٹگری کاانتخاب کریں"}
                atSelect={(val: any) => {
                  console.log("sub valu ----  ", val);

                  setRtlCatSubError("");
                  setRtlSelectedSubCat(val);
                }}
                selected={rtlSelectedSubCat?.name}
                optionKey={"name"}
                list={rtlSubCatList}
              />
              {catSubError && (
                <Text style={styles.errorMsg}>{catSubError}</Text>
              )}
            </>
          )}

          <Text style={styles.label}>
            {isRtl ? "مصنوعات کی تصاویر منسلک کریں" : "Attach Product Images"}
          </Text>
          <View style={styles.imgWrapper}>
            <View
              style={{
                marginTop: normalized(20),
                flexWrap: "wrap",
                flexDirection: isRtl ? "row-reverse" : "row",
                alignItems: "center",
              }}
            >
              {imageList.map((el: any, index: any) => {
                const imageUri = typeof el === "string" ? el : el?.url;

                return (
                  <TouchableOpacity
                    key={index}
                    activeOpacity={1}
                    style={styles.singleImageCont}
                    onPress={() => {
                      setImageView({
                        value: true,
                        imagesList: imageList,
                        initialIndex: index,
                      });
                    }}
                  >
                    {/* Close Button */}
                    <TouchableOpacity
                      style={styles.closeImgCont}
                      onPress={() => removeImage(index)}
                    >
                      <Image
                        source={AppImages.Home.close}
                        style={styles.closeImg}
                      />
                    </TouchableOpacity>

                    {/* Image Viewer (Handles both Firebase URL & Local File Path) */}
                    <AppImageViewer
                      style={styles.singleImageCont}
                      source={{ uri: imageUri }}
                    />
                  </TouchableOpacity>
                );
              })}

              {imageList.length < 10 && (
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
          limit={10 - imageList?.length}
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
                imagesArr?.length > 4 ? imagesArr.slice(0, 10) : imagesArr
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
    fontSize: normalized(14),
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
    flexWrap: "wrap",
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
    flex: 1,
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
  singleImageCont: {
    height: normalized(70),
    width: normalized(70),
    margin: normalized(5),
    borderRadius: normalized(10),
    borderWidth: 1,
    borderColor: AppColors.themeColor.dark,
    justifyContent: "center",
    alignItems: "center",
    // flexWrap: "wrap",
  },
  closeImg: {
    resizeMode: "contain",
    width: normalized(10),
    height: normalized(10),
  },
  closeImgCont: {
    position: "absolute",
    backgroundColor: AppColors.white.white,
    zIndex: 20,
    borderRadius: normalized(10),
    padding: normalized(3),
    top: 3,
    right: 3,
  },
  checkCont: {
    borderRadius: normalized(5),
    height: normalized(20),
    width: normalized(20),
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  checkTxt: {
    fontSize: normalized(13),
    fontFamily: AppFonts.PoppinsMedium,
    color: AppColors.black.black,
  },
  checkMainCont: {
    gap: normalized(15),
    alignItems: "center",
    marginTop: normalized(15),
  },
});
