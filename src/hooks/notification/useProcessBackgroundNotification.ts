import { useEffect, useRef } from 'react';
import notifee, { } from '@notifee/react-native';
import { WorkoutService } from '../../services/WorkoutService';
import LogHelper from '../../helper/LogHelper';
import { LogService } from '../../services/Log/LogService';
import { ScreenNames } from '../../views/Screens/ScreenNames';
import { ServiceRegistry } from '../../services/ServiceRegistry';
import { AppState, AppStateStatus } from 'react-native';
import { getLastBackgroundNotification, NotificationDetail } from '../../global/Globals';
import { NotificationsConstants } from '../../helper/NotificationHelper';


export function useProcessBackgroundNotification(navigation: any) {
    const appState = useRef(AppState.currentState);

    // LogService.infoFormat('Home-useProcessBackgroundNotification rerender appState: {0} ', AppState.currentState);

    useEffect(() => {
        const subscription = AppState.addEventListener('change', async nextAppState => {
            if (
                appState.current.match(/inactive|background/) &&
                nextAppState === 'active'
            ) {
                // LogService.infoFormat('Home-useProcessBackgroundNotification  foreground! nextAppState:{0}  previousAppState:{1}', nextAppState, appState.current);
                const initialNotification = await notifee.getInitialNotification();
                const notification = initialNotification?.notification;
                const pressAction = initialNotification?.pressAction;
                // LogService.infoFormat('Home-useProcessBackgroundNotification foreground initialNotification:{0} \n pressAction:{1}', LogHelper.toString(initialNotification), LogHelper.toString(pressAction));

                // with custom notification
                // const detail = getLastBackgroundNotification();
                // const notification = detail?.notification;
                // LogService.infoFormat('Home-useProcessBackgroundNotification foreground lastNotificationDetail: {0} \n initialNotification:{1}', LogHelper.toString(detail), LogHelper.toString(initialNotification));

                if (notification?.id != null && pressAction?.id == NotificationsConstants.pressActionIdDefault) {
                    // LogService.infoFormat('Home-useProcessBackgroundNotification foreground there is notification ');

                    // if (navigation.canGoBack()) {
                    //     navigation.popToTop();
                    // }
                    navigation.navigate(ScreenNames.MainHome);

                    // navigation.reset({ index: 0, routes: [{ name: ScreenNames.MainHome }] });

                    const registry = ServiceRegistry.getInstance();
                    const workoutService = registry.getService(WorkoutService.Basename) as WorkoutService;
                    const tmpWorkouts = workoutService.getWorkouts();
                    const workoutId = notification.data?.workoutid;
                    // LogService.infoFormat('Home-useProcessBackgroundNotification foreground workoutId {0}', workoutId);
                    if (workoutId != null && workoutId !== '') {
                        const tmpWorkout = tmpWorkouts?.find(item => item.id === workoutId);
                        // LogService.infoFormat('Home-useProcessBackgroundNotification foreground mpWorkout {0}', LogHelper.toString(tmpWorkout));
                        if (tmpWorkout != null) {
                            // LogService.infoFormat('Home-useProcessBackgroundNotification foreground navigate {0}', tmpWorkout.name);
                            navigation.navigate(ScreenNames.MainWorkoutPlayer, { workout: tmpWorkout });
                        }
                        // LogService.infoFormat('checkNotifications workout {0}', LogHelper.toString(workout));
                    }
                }
            }
            else {
                // LogService.infoFormat('Home-useProcessBackgroundNotification background nextAppState:{0}', nextAppState);
            }

            if (appState.current != nextAppState) {
                appState.current = nextAppState;
                // LogService.infoFormat('Home-useProcessBackgroundNotification  change states  nextAppState:{0}  previousAppState:{1}', appState.current);
            }
            // LogService.infoFormat('AppState', appState.current);
        });

        return () => {
            subscription.remove();
        };
    }, []);
    // useEffect(() => {

    //     const detail = getLastBackgroundNotification();
    //     LogService.infoFormat('Home-useProcessBackgroundNotification lastNotificationDetail: {0} , appState: {1}', LogHelper.toString(detail), AppState.currentState);

    //     // if (notification != null && notification.id != null) {

    //     //     // if (navigation.canGoBack()) {
    //     //     //     navigation.popToTop();
    //     //     // }
    //     //     navigation.navigate(ScreenNames.MainHome);

    //     //     // navigation.reset({ index: 0, routes: [{ name: ScreenNames.MainHome }] });

    //     //     const registry = ServiceRegistry.getInstance();
    //     //     const workoutService = registry.getService(WorkoutService.Basename) as WorkoutService;
    //     //     const tmpWorkouts = workoutService.getWorkouts();
    //     //     const workoutId = notification.data?.workoutid;
    //     //     if (workoutId != null && workoutId !== '') {
    //     //         const tmpWorkout = tmpWorkouts?.find(item => item.id === workoutId);
    //     //         if (tmpWorkout != null) {
    //     //             LogService.infoFormat('Home-onBackgroundEvent navigate {0}', tmpWorkout.name);
    //     //             navigation.navigate(ScreenNames.MainWorkoutPlayer, { workout: tmpWorkout });
    //     //         }
    //     //         // LogService.infoFormat('checkNotifications workout {0}', LogHelper.toString(workout));
    //     //     }
    //     // }

    // }, []);
}
