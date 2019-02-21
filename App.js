import { createAppContainer, createStackNavigator } from "react-navigation";
import { YellowBox } from "react-native";

import Login from "./src/pages/Login";
import Home from "./src/pages/Home";

YellowBox.ignoreWarnings(["Setting a timer for a long period of time"]);

const AppNavigator = createStackNavigator(
  {
    Home,
    Login
  },
  {
    initialRouteName: "Login",
    defaultNavigationOptions: {
      header: null
    }
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;
