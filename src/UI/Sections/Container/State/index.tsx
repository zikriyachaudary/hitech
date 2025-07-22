import { useSelector } from "react-redux";
import {
  NotificationStack,
  UserOrderStack,
} from "../../../../Navigation/InnerStack";
import { ProfileStack } from "../../../../Navigation/InnerStack";
import { OrderStack } from "../../../../Navigation/InnerStack";
import { HomeStack } from "../../../../Navigation/InnerStack";
import { AppRootStore } from "../../../../Redux/store/AppStore";

export const setContainerStack = (index: any) => {
  const selector: any = useSelector(
    (state: AppRootStore) => state.SliceReducer
  );
  const isAdmin = selector?.userData?.isAdmin;

  if (index == 0) {
    return <HomeStack />;
  } else if (index == 1) {
    return isAdmin ? <OrderStack /> : <UserOrderStack />;
  } else if (index == 2) {
    return <NotificationStack />;
  } else if (index == 3) {
    return <ProfileStack />;
  }
};
