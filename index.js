/**
 * @format
 */

import { AppRegistry } from "react-native";
import App from "./App";
import { name as appName } from "./app.json";
import store from "./src/Redux/store/AppStore";
import { Provider } from "react-redux";
// import "react-native-reanimated";
import "react-native-get-random-values";

const AppRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent(appName, () => AppRedux);
