import { useEffect } from 'react';
import notifee, { EventType } from '@notifee/react-native';
import { notifProcessInternalNotification } from '../../helper/NotificationHelper';


export function useProcessForegroundNotification() {

    // LogService.infoFormat('Home-useProcessBackgroundNotification rerender appState: {0} ', AppState.currentState);

    // Subscribe to events
    useEffect(() => {
        return notifee.onForegroundEvent(async ({ type, detail }) => {
            const { notification } = detail;
            // LogService.infoFormat('Home-useProcessForegroundNotification detail: {0} \n type:{1}', LogHelper.toString(detail), type);
            if (type == EventType.DELIVERED
                // || type == EventType.TRIGGER_NOTIFICATION_CREATED // test purpose
            ) {
                notifProcessInternalNotification(notification);
            }
        });
    }, []);
}
