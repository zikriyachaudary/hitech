import { NotificationStack } from "../../../../Navigation/InnerStack";
import { ProfileStack } from "../../../../Navigation/InnerStack";
import { OrderStack } from "../../../../Navigation/InnerStack";
import { HomeStack } from "../../../../Navigation/InnerStack";

export const setContainerStack = (index: any) => {
  if (index == 0) {
    return <HomeStack />;
  } else if (index == 1) {
    return <OrderStack />;
  } else if (index == 2) {
    return <NotificationStack />;
  } else if (index == 3) {
    return <ProfileStack />;
  }
};
