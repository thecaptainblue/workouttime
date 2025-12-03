import { Notification } from "@notifee/react-native";

// simple mechanism for getting background notification but I prefered to use notifee initialNotification

export interface NotificationDetail {
    notification: Notification;
}

let lastBackGroundNotification: NotificationDetail | null;

export function getLastBackgroundNotification(): NotificationDetail | null {
    const result = lastBackGroundNotification;
    lastBackGroundNotification = null;
    return result;
}

export function setLastBackgroundNotification(notification: NotificationDetail | null) {
    lastBackGroundNotification = notification;
}