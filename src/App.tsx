import React from 'react';
import {Platform} from "react-native";
import { Provider } from "react-redux";
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useMediaQuery } from 'react-responsive';
import HomeScreen from './screens/HomeScreen';
import AboutScreen from './screens/about';
import LoginScreen from './screens/LoginScreen';
import store from './state/store';

const Stack = createStackNavigator();

const linking = {
  prefixes: ['https://react-native-dotnet-example.com', 'dotnetexample://'],
  config: {
    screens: {
      Home: '',
      About: '/about',
      Login: '/login'
    },
  },
};

const App = () => {
  const isDesktop = useMediaQuery({
    query: '(min-device-width: 1224px)',
  });

  return (
    <Provider store={store}>
      <NavigationContainer linking={linking}>
        <Stack.Navigator headerMode="screen" screenOptions={{ headerShown: !isDesktop }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="About" component={AboutScreen} />
          {!(Platform.OS === 'web') && <Stack.Screen name="Login" component={LoginScreen} />}
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
