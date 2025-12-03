import React from 'react';
import { ColorConstants } from './constants/StyleConstants';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainStackScreen } from './views/Screens/MainStackScreen';
import { SettingStackScreen } from './views/Screens/SettingStackScreen';
// import { useInitializeTts } from './hooks/useInitializeTts';
import AntSettingsIcon from 'react-native-vector-icons/AntDesign';
import EntypoHomeIcon from 'react-native-vector-icons/Entypo';
// import { useInitializeInternationalization } from './hooks/useInitializeInternationalization';
import { DarkTheme } from '@react-navigation/native';
import { ScreenNames } from './views/Screens/ScreenNames';
import { NavHelper } from './helper/NavHelper';
import { NavigatorTypes } from './@types/NavigatorTypes';
import { LogService } from './services/Log/LogService';
import { navigationRef } from './helper/RootNavigation';
import { Text } from 'react-native';
// import { TestStackScreen } from './views/Screens/TestStackScreen';
import Config from './@types/config/Config';

const customTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: ColorConstants.background,
    // card: ColorConstants.backgroundNew,
  },
};
const TabNavigator = createBottomTabNavigator();

// LogService.disable();
enum TabScreenName {
  main = 'Main',
  settings = 'Settings',
}

// LogService.infoFormat('App Config {0}', LogHelper.toString(Config));

export default function App() {
  // const dispatch = useDispatch();
  // dispatch(setTS({key: ProfilingTSNames.HandleAppStarted, ts: ProfilingHelper.createTs()} satisfies PayloadSetTS));
  // useInitializeTts();
  // useInitializeInternationalization();
  // // console.log('ScreenNames.MainHome: ', ScreenNames.MainHome);
  if (Config.configType != null && Config.configType != undefined) {
    LogService.infoFormat('rerender App configType:{0} , Config.isDebug:{1}', Config.configType, Config.isDebug);
  } else {
    console.info('rerender App configType:couldnt read !!', Config.configType);
  }
  return (
    <NavigationContainer ref={navigationRef} theme={customTheme}>
      <TabNavigator.Navigator
        initialRouteName={TabScreenName.main}
        // initialRouteName={Config.isDebug ? 'Test' : undefined} // TODO yukseltme
        screenOptions={({ route, navigation }) => ({
          // tabBarIcon: ({focused, color, size}) => {
          //   if (route.name === 'Main') {
          //     return <EntypoHomeIcon name="home" size={size} color={color} />;
          //   } else if (route.name === 'Settings') {
          //     return <AntSettingsIcon name="setting" size={size} color={color} />;
          //   }
          // },
          tabBarInactiveBackgroundColor: ColorConstants.surfaceEl6,
          tabBarActiveBackgroundColor: ColorConstants.surfaceEl6,
          // tabBarInactiveTintColor: ,
          tabBarActiveTintColor: ColorConstants.onSurface,
          tabBarShowLabel: false,
          headerShown: false,
          // lazy: true,
          // tabBarStyle: {
          //   // borderTopWidth: 0,
          //   // backgroundColor: ColorConstants.background,
          //   backgroundColor: 'blue',
          //   borderWidth: 1,
          //   borderColor: 'red',
          //   height: 50,
          //   // marginBottom: 50,
          // },
          // tabBarBackground: () => (
          //   <View style={[StyleSheet.absoluteFill, {backgroundColor: ColorConstants.backgroundNew}]} />
          // ),
          // tabBarStyle: {
          //   display: isRouteNameEqual(route.name, navigation, ScreenNames.MainHome) ? 'none' : 'flex',
          //   // display: 'none',
          // },
        })}>
        <TabNavigator.Screen
          name={TabScreenName.main}
          component={MainStackScreen}
          options={({ route, navigation }) => {
            const navigationState = navigation.getState();
            return {
              tabBarIcon: ({ focused, color, size }) => {
                return <EntypoHomeIcon name="home" size={size} color={color} />;
              },
              tabBarStyle: {
                display: NavHelper.isCurrentRoute(navigationState, [
                  { routeNames: [TabScreenName.main], type: NavigatorTypes.tab },
                  { routeNames: [ScreenNames.MainHome], type: NavigatorTypes.stack },
                ])
                  ? 'flex'
                  : 'none',
                // display: 'none',
              },
            };
          }}
        />
        <TabNavigator.Screen
          name={TabScreenName.settings}
          component={SettingStackScreen}
          options={{
            tabBarIcon: ({ focused, color, size }) => {
              return <AntSettingsIcon name="setting" size={size} color={color} />;
            },
          }}
        />
        {  /**
         {
           Config.isDebug &&
           (
             <TabNavigator.Screen
               name="Test"
               component={TestStackScreen}
               options={{
                 tabBarIcon: ({ focused, color, size }) => {
                   return <AntSettingsIcon name="medicinebox" size={size} color={color} />;
                 },
               }}
             />
           )}
            */
        }

      </TabNavigator.Navigator>
    </NavigationContainer>
  );
}
