import { useDispatch, useSelector } from "react-redux";
import { updateCartDetail } from "../Redux/Reducers/AppReducers";
import { AppRootStore } from "../Redux/store/AppStore";

const CartManager = () => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const dispatch = useDispatch();
  const cartDetail = useSelector((state: any) => state.SliceReducer.cartDetail);

  const updateProductList = (productObj: any) => {
    const updatedArr = [...cartDetail];
    const existingProductIndex = updatedArr.findIndex(
      (el) => el?.id === productObj?.id
    );
    if (existingProductIndex !== -1) {
      updatedArr[existingProductIndex] = productObj;
    } else {
      updatedArr.push(productObj);
    }
    dispatch(updateCartDetail(updatedArr));
  };

  const removeProductFromCart = (productId: any) => {
    const updatedArr = cartDetail.filter(
      (item: any) => item.productId !== productId
    );
    dispatch(updateCartDetail(updatedArr));
  };

  const getProductsTotalPrice = (isTotalPrice: boolean) => {
    let totalPrice: any = 0;
    cartDetail.map((el: any) => {
      const price = Number(el?.unitPrice || el?.price) * el?.count;
      totalPrice = totalPrice + price;
    });

    return Number(isTotalPrice ? totalPrice + 200 : totalPrice).toFixed(2);
  };

  return {
    updateProductList,
    removeProductFromCart,
    getProductsTotalPrice,
  };
};

export default CartManager;
