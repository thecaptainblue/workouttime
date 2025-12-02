// debugger;
import React, { useCallback, useEffect, useRef, useState } from 'react';
import App from './App';
// import { store } from './store/Store';
// import { Provider } from 'react-redux';
// import { SoundService } from './services/SoundService';
import { ServiceRegistry } from './services/ServiceRegistry';
import { LogService } from './services/Log/LogService';
// import { SettingsService } from './services/Settings/SettingsService';
// import { FSService } from './services/FS/FSService';
import { IService } from './services/IService';
// import { PlatformAndroidService } from './services/platform/PlatformAndroidService';
import { View, DeviceEventEmitter, Dimensions, AppState, Platform, AppStateStatus } from 'react-native';
// import { WorkoutService } from './services/WorkoutService';
import {
  Gesture,
  GestureDetector,
  GestureHandlerRootView,
  GestureStateChangeEvent,
  TapGestureHandlerEventPayload,
} from 'react-native-gesture-handler';
// import { EventName } from './@types/EventNames';
// import { runOnJS } from 'react-native-reanimated';
// import SplashScreen from 'react-native-splash-screen';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import Toast from 'react-native-toast-message';
// import { toastConfig } from './helper/ToastConfig';
// import { RealmProvider } from '@realm/react';
// import { StatisticDoc } from './persistence/StatisticDoc';
// import { RuleDoc } from './persistence/RuleDoc';
// import { RuleItemDoc } from './persistence/RuleItemDoc';
// import Config from './@types/config/Config';
// import { TrackDoc } from './persistence/TrackDoc';
// import { RealmMigrationFunction, RealmSchemaVersion } from './persistence/RealmMigration';
// import mobileAds from 'react-native-google-mobile-ads';
// import { AdProvider } from './providers/AdProvider';
// import { SystemDoc } from './persistence/SystemDoc';

export const AppConstants = {
  windowWidth: Dimensions.get('window').width,
  windowHeight: Dimensions.get('window').height,
};

export default function AppMain() {
  const registryRef = useRef(ServiceRegistry.getInstance());
  const [isInitialized, setInitialized] = useState(false);
  // const [realmKey, setRealmKey] = useState(0);

  useEffect(() => {
    LogService.debug('start========================AppMain initialize');
    let services: IService[] = [];
    let tmpService: IService;

    // tmpService = new FSService();
    // services.push(tmpService);

    // tmpService = new PlatformAndroidService();
    // services.push(tmpService);

    // tmpService = new SoundService();
    // services.push(tmpService);

    // tmpService = new SettingsService();
    // services.push(tmpService);

    // tmpService = new WorkoutService();
    // services.push(tmpService);

    services.forEach(service => registryRef.current.addService(service));
    services.forEach(service => service.initialize());

    setInitialized(true);
    return () => {
      services.forEach(service => service.finalize());
    };
  }, []);

  // useEffect(() => {
  //   mobileAds()
  //     .initialize()
  //     .then(adapterStatuses => {
  //       console.log('Mobile Ads initialized!');
  //     });
  // }, []);

  // useEffect(() => {
  //   if (isInitialized) {
  //     SplashScreen.hide();
  //     console.log('hide SplashScreen');
  //   }
  // }, [isInitialized]);

  // useEffect(() => {
  //   const listener = DeviceEventEmitter.addListener(EventName.RealmEventReopen, () => {
  //     LogService.infoFormat('AppMain useEffect; change realm key {0}', realmKey);
  //     setRealmKey(currentKey => currentKey + 1);
  //   });
  //   return () => {
  //     listener.remove();
  //   };
  // }, []);

  // const throwEvent = useCallback((event: GestureStateChangeEvent<TapGestureHandlerEventPayload>) => {
  //   DeviceEventEmitter.emit(EventName.TouchedEvent, event);
  // }, []);

  const native = Gesture.Tap()
    .numberOfTaps(5) // tek tik oldugunda nedense soft back buttonu calismaz hale getiriyor.
    .onBegin(event => {
      // console.log(
      //   'onBegin  absY: %s ev.x:%s ev.y:%s ',
      //   event.absoluteY.toFixed(2),
      //   event.x.toFixed(2),
      //   event.y.toFixed(2),
      // );
      // runOnJS(throwEvent)(event); // TODO yukseltme reanimated yuklendiginde acacagim.
    });

  LogService.debug('AppMain========================render');
  // let content;
  // if (isInitialized) {
  //   content = (
  //     <>
  //       <SafeAreaProvider>
  //         <Provider store={store}>
  //           <AdProvider>
  //             <RealmProvider
  //               key={realmKey}
  //               schema={[StatisticDoc, RuleDoc, RuleItemDoc, TrackDoc, SystemDoc]}
  //               // deleteRealmIfMigrationNeeded={Config.isDebug == true ? true : false} // todo: dont upload like this.
  //               schemaVersion={RealmSchemaVersion}
  //               onMigration={RealmMigrationFunction}
  //               migrationOptions={{ resolveEmbeddedConstraints: true }}
  //               closeOnUnmount={false}>
  //               <GestureHandlerRootView
  //                 style={{ flex: 1 }}
  //                 onLayout={event => {
  //                   // console.log('AppMain-GestureHandlerRootView ', LogHelper.toString(event.nativeEvent.layout));
  //                 }}>
  //                 <GestureDetector gesture={native}>
  //                   <App />
  //                 </GestureDetector>
  //               </GestureHandlerRootView>
  //             </RealmProvider>
  //           </AdProvider>
  //         </Provider>
  //       </SafeAreaProvider>
  //       <Toast config={toastConfig} position="bottom" bottomOffset={70} />
  //     </>
  //   );
  // } else {
  //   content = <View></View>;
  // }

  // return content;
  ///////////////////////////===========
  let content;
  if (isInitialized) {
    content = (
      <>
        <GestureHandlerRootView
          style={{ flex: 1 }}
          onLayout={event => {
            // console.log('AppMain-GestureHandlerRootView ', LogHelper.toString(event.nativeEvent.layout));
          }}>
          <GestureDetector gesture={native}>
            <App />
          </GestureDetector>
        </GestureHandlerRootView>
      </>
    );
  } else {
    content = <View></View>;
  }

  return content;

}
