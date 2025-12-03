
import notifee, { AlarmType, AndroidImportance, AndroidNotificationSetting, EventType, IntervalTrigger, Notification, RepeatFrequency, TimestampTrigger, TimeUnit, TriggerNotification, TriggerType } from '@notifee/react-native';
import { ColorConstants } from '../constants/StyleConstants';
import { LogService } from '../services/Log/LogService';
import { WorkoutTimeData } from '../@types/Data/WorkoutTimeData';
import TimeConstants from './TimeConstants';
import { NotificationData } from '../@types/Data/NotificationData';
import { GenHelper } from './GenHelper';
import { WorkoutTimeHelper } from '../@types/WorkoutTimeHelper';
import LogHelper, { logError } from './LogHelper';
import { String } from 'typescript-string-operations';
import { DateHelper } from './DateHelper';
import { WeekDay } from '../@types/WeekDay';
import { DayOfWeekHelper } from './DayOfWeekHelper';
import i18n from 'i18next';
import { ResKey } from '../lang/ResKey';

const NotificationTimeCheckOffsetInMilliseconds = TimeConstants.Time1MinInMilliseconds / 6;
// const NotificationTimeCheckOffset = TimeConstants.Time1MinInMilliseconds;

export type DataType = {
    [key: string]: string | object | number;
};

export enum NotificationChannelType {
    External,
    Internal,
}

export type DataTypeWorkout = { workoutid: string, daysOfWeek?: string };

type NotificationCharacter = {
    channelType: NotificationChannelType;
    triggerRepeatFrequency: RepeatFrequency;
}

export const NotificationsConstants = {
    channelIdExternal: 'External',
    channelNameExternal: 'External NC', // todo: Workout Time Channel'a cevrilecek.
    channelIdInternal: 'Internal',
    channelNameInternal: 'Internal NC',
    // channelId: 'fer',
    // channelName: 'fer Channel', // todo: Workout Time Channel'a cevrilecek.
    // title: 'Workout Time',
    messageBody: '',
    pressActionIdDefault: 'default',
    soundDefault: 'default',
    idOsDefault: '',
}

export class NotificationHelper {
    static createNotificationDataWorkout(workoutid: string, daysOfWeek?: boolean[] | null): DataTypeWorkout {
        return { workoutid: workoutid, daysOfWeek: daysOfWeek != null ? JSON.stringify(daysOfWeek) : '' } satisfies DataTypeWorkout;
    }

    static checkNotificationByWorkoutId(workoutId: string, notification: TriggerNotification): boolean {
        let result = false;
        if (notification != null) {
            const data = notification.notification.data as DataTypeWorkout;
            if (data != null && data.workoutid == workoutId) {
                result = true;
            }
        }
        return result;
    }

    static checkNotificationByWorkoutIds(workoutIds: string[], notification: TriggerNotification): boolean {
        let result = false;
        if (notification != null) {
            const data = notification.notification.data as DataTypeWorkout;
            if (data != null && workoutIds.includes(data.workoutid)) {
                result = true;
            }
        }
        return result;
    }

    static isWorkoutAndOSNotificationSame(workoutId: string, workoutName: string, workoutNotification: NotificationData, osNotification: TriggerNotification) {
        let result = false;
        const t = i18n.t
        const messageTitle = NotificationHelper.createNotificationMessage(workoutName, workoutNotification.time, t(ResKey.NotificationTitlePrefixMessage));
        const data = NotificationHelper.createNotificationDataWorkout(workoutId, workoutNotification.daysOfWeek);
        // const isDataSame = GenHelper.isSimpleDeepEqual(data, osNotification.notification.data);
        // LogService.warnFormat('isWorkoutAndOSNotificationSame isDataSame: {0} \nnewData:{1},\n osData:{2}', isDataSame, LogHelper.toString(data), LogHelper.toString(osNotification.notification.data));
        if (workoutNotification != null && osNotification != null
            && messageTitle == osNotification.notification.title
            // && workoutNotification. == osNotification.notification.body 
            && GenHelper.isSimpleDeepEqual(data, osNotification.notification.data)
            && osNotification.trigger != null
        ) {
            // const androidTrigger = osNotif.notification.android;
            const trigger = osNotification.trigger as TimestampTrigger;
            // LogService.infoFormat('isWorkoutAndOSNotificationSame  timestamp {0}', trigger.timestamp)
            if (trigger.timestamp != undefined && WorkoutTimeHelper.isHourMinutesSame(workoutNotification.time, trigger.timestamp)) {
                result = true;
            }
        }
        return result;
    }

    static createDate(time: WorkoutTimeData) {
        const dateNowTimestamp = Date.now();
        let date = DateHelper.createDate(time, dateNowTimestamp);

        // LogService.infoFormat('NotificationHelper.createDate, createdTime:{0}, now:{1}', date.getTime(), dateNowTimestamp);
        if (date.getTime() <= (dateNowTimestamp + NotificationTimeCheckOffsetInMilliseconds)) {
            // date = new Date(date.getTime() + 1000 * 60 * 60 * 24 * 1); // add one day
            date = new Date(date.getTime() + TimeConstants.Time1DayInMilliseconds); // add one day
            // date = new Date(date.getTime() + TimeConstants.Time1MinInMilliseconds * 2); // 1minute
        }
        return date;
    }

    static createDateForWeekly(time: WorkoutTimeData, day: WeekDay) {
        const dateNowTimestamp = Date.now();
        const dateTime = DateHelper.createDate(time, dateNowTimestamp);
        const dateTimdeIndexDay = DayOfWeekHelper.getWeekDayFromDateIndex(dateTime.getDay());
        let differenceInIndex = day as number - dateTimdeIndexDay as number;
        differenceInIndex = differenceInIndex >= 0 ? differenceInIndex : differenceInIndex + 7;
        let nextDate = new Date(dateTime.getTime() + differenceInIndex * TimeConstants.Time1DayInMilliseconds);
        // LogService.infoFormat('NotificationHelper.getNextDay, createdTime:{0}, now:{1}', nextDate.getTime(), dateNowTimestamp);
        if (nextDate.getTime() <= (dateNowTimestamp + NotificationTimeCheckOffsetInMilliseconds)) {
            nextDate = new Date(nextDate.getTime() + TimeConstants.Time1DayInMilliseconds * 7); // add 7 day
        }
        return nextDate;
    }

    static createNotificationData(id: string, idOs: string, title: string, message: string, time: WorkoutTimeData, daysOfWeek?: boolean[] | null): NotificationData {
        return { id: id, idOs: idOs, title: title, message: message, time: time, daysOfWeek: daysOfWeek } satisfies NotificationData;
    }

    static isTimeCollide(notifications: NotificationData[], notificationId: string | null, newTime: WorkoutTimeData) {
        // todo gunluk ve haftalik olan timerlarin durumunu ele alacagim.
        let result = false;
        if (notifications != null) {
            const index = notifications.findIndex(item => item.id != notificationId && item.time.hours == newTime.hours && item.time.minutes == newTime.minutes);
            if (index >= 0) {
                result = true;
            }
        }
        return result
    }

    static getTimeText(time: WorkoutTimeData) {
        return String.format('{0:00}', time.hours) + ':' + String.format('{0:00}', time.minutes);
    }

    static createNotificationMessage(workoutName: string, time: WorkoutTimeData, prefixMessage: string): string {
        return prefixMessage + ' ' + workoutName + ' ' + NotificationHelper.getTimeText(time);
    }



    static getNotificationCharacter(daysOfWeek?: boolean[] | null): NotificationCharacter {
        let channelType = NotificationChannelType.External; // haftada 1 gun(weekly) , her gun (daily)
        let repeatFrequency = RepeatFrequency.DAILY;
        const activeDays = DayOfWeekHelper.getActiveDayOfWeek(daysOfWeek);
        if (daysOfWeek != null && activeDays > 1 && activeDays < 7) { // 2,6 
            channelType = NotificationChannelType.Internal;
        }
        if (activeDays == 1) {
            repeatFrequency = RepeatFrequency.WEEKLY;
        }

        return { channelType: channelType, triggerRepeatFrequency: repeatFrequency };
    }
}

export async function notifCreateChannelExternal() {
    // notifee.deleteChannel(NotificationsConstants.channelId); // todo: test icin , kullanimda kaldiracagim.
    const channelId = await notifee.createChannel({
        id: NotificationsConstants.channelIdExternal,
        name: NotificationsConstants.channelNameExternal,
        importance: AndroidImportance.HIGH,
        sound: NotificationsConstants.soundDefault,
    });
    return channelId;
}

export async function notifCreateChannelInternal() {
    // notifee.deleteChannel(NotificationsConstants.channelId); // todo: test icin , kullanimda kaldiracagim.
    const channelId = await notifee.createChannel({
        id: NotificationsConstants.channelIdInternal,
        name: NotificationsConstants.channelNameInternal,
        importance: AndroidImportance.NONE,
        vibration: false,
    });
    return channelId;
}

async function createTriggerNotification(channelId: string, title: string | undefined, messageBody: string | undefined, trigger: TimestampTrigger, notificationImportance: AndroidImportance, data?: DataType, notificationIdOs?: string) {

    let notificationIdObject = {};
    if (notificationIdOs != undefined) {
        notificationIdObject = { id: notificationIdOs }
    }

    const notifId = await notifee.createTriggerNotification(
        {
            ...notificationIdObject,
            title: title,
            body: messageBody,
            data: data,
            android: {
                channelId: channelId,
                importance: notificationImportance,
                // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
                // pressAction is needed if you want the notification to open the app when pressed
                showTimestamp: true,
                groupSummary: true,
                pressAction: {
                    id: NotificationsConstants.pressActionIdDefault,
                },
                color: ColorConstants.primary,
                lights: [ColorConstants.primary, 1500, 500],
            },
        },
        trigger,
    );
    return notifId;
}

async function displayNotification(channelId: string, title: string, messageBody: string, data: DataType, notificationImportance: AndroidImportance,) {
    // Display a notification
    const notifId = await notifee.displayNotification({
        title: title,
        body: messageBody,
        data: data,
        android: {
            channelId,
            importance: notificationImportance,
            // smallIcon: 'name-of-a-small-icon', // optional, defaults to 'ic_launcher'.
            // pressAction is needed if you want the notification to open the app when pressed
            showTimestamp: true,
            groupSummary: true,
            pressAction: {
                id: NotificationsConstants.pressActionIdDefault,
            },
            color: ColorConstants.primary,
            lights: [ColorConstants.primary, 1500, 500],
        },
    });
    return notifId;
}

export async function notifDisplayNotification(channelId: string, title: string, messageBody: string, data: DataType, notificationImportance: AndroidImportance,) {
    try {
        const notifId = await displayNotification(channelId, title, messageBody, data, notificationImportance);
    } catch (e) {
        logError(e);
    }
}

export interface SetTriggerNotificationProps {
    time: WorkoutTimeData;
    messageTitle?: string | undefined;
    messageBody?: string | undefined;
    daysOfWeek?: boolean[] | null;
    data?: DataType,
    notificationIdOs?: string,
}

export async function notifSetTriggerNotification(props: SetTriggerNotificationProps): Promise<string | null> {
    // LogService.debug('displayTriggerNotification: ');
    const { time, messageTitle, messageBody, daysOfWeek, data, notificationIdOs } = props

    //todo: bu istegin yerine ve verilmediginde nelerin kisitlanmasi gerektigini duzenleyecegim.
    // Request permissions (required for iOS)
    await notifee.requestPermission();

    // Create a channel (required for Android)
    // notifee.deleteChannel(NotificationsConstants.channelId); // todo: test icin , kullanimda kaldiracagim.
    let channelId: string;
    const notificationCharacter = NotificationHelper.getNotificationCharacter(daysOfWeek);
    let notificationImportance: AndroidImportance; // todo gerek olmayabilir .
    if (notificationCharacter.channelType == NotificationChannelType.Internal) {
        channelId = await notifCreateChannelInternal();
        notificationImportance = AndroidImportance.NONE;
    }
    else {
        channelId = await notifCreateChannelExternal();
        notificationImportance = AndroidImportance.HIGH
    }

    let timestamp: number = 0;
    if (notificationCharacter.triggerRepeatFrequency == RepeatFrequency.DAILY) {
        const timeDate = NotificationHelper.createDate(time);
        timestamp = timeDate.getTime();
    } else if (notificationCharacter.triggerRepeatFrequency == RepeatFrequency.WEEKLY) {
        const day = daysOfWeek?.findIndex(item => item == true) as WeekDay; // daysOfWeek array are structured based on WeekDay enum.
        const timeDate = NotificationHelper.createDateForWeekly(time, day);
        timestamp = timeDate.getTime();
    }

    // Create a time-based trigger
    const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: timestamp, // fire at 11:10am (10 minutes before meeting)
        repeatFrequency: notificationCharacter.triggerRepeatFrequency,
        alarmManager: { type: AlarmType.SET_EXACT },
        // alarmManager: true,
    };

    const triggerInterval: IntervalTrigger = {
        type: TriggerType.INTERVAL,
        interval: 30,
        timeUnit: TimeUnit.SECONDS,
    };

    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm == AndroidNotificationSetting.ENABLED) {
        // LogService.infoFormat('notifSetTriggerNotification alarm enabled')
        //Create timestamp trigger
    } else {
        // Show some user information to educate them on what exact alarm permission is,
        // and why it is necessary for your app functionality, then send them to system preferences:
        await notifee.openAlarmPermissionSettings();
    }
    let notifId: string | null = null;
    // Create a trigger notification
    try {
        notifId = await createTriggerNotification(channelId, messageTitle, messageBody, trigger, notificationImportance, data, notificationIdOs);
        // LogService.infoFormat('notifSetTriggerNotification notifId: {0}', notifId)
    } catch (e) {
        logError(e);
    }
    return notifId;
};

export async function notifAddTriggerNotification(notificationIdWt: string, messageTitle: string, messageBody: string, time: WorkoutTimeData, data?: DataType, daysOfWeek?: boolean[] | null): Promise<NotificationData> {
    let notification = NotificationHelper.createNotificationData(notificationIdWt, NotificationsConstants.idOsDefault, messageTitle, messageBody, time, daysOfWeek)
    const notificationIdOs = await notifSetTriggerNotification({
        time: time, messageTitle: notification.title, messageBody: notification.message,
        data: data, daysOfWeek: daysOfWeek,
    })
    if (notificationIdOs != null) {
        notification.idOs = notificationIdOs;
    }
    else {
        notification.hasError = true;
    }
    return notification;
}

export async function notifUpdateTriggerNotification(notificationIdWt: string, idOs: string, messageTitle: string, messageBody: string, time: WorkoutTimeData, data?: DataType, daysOfWeek?: boolean[] | null): Promise<NotificationData> {
    let notification = NotificationHelper.createNotificationData(notificationIdWt, idOs, messageTitle, messageBody, time, daysOfWeek);
    const tmpNotificationId = await notifSetTriggerNotification({
        time: time, messageTitle: notification.title, messageBody: notification.message,
        data: data, daysOfWeek: daysOfWeek,
        notificationIdOs: idOs,
    })

    if (tmpNotificationId == null || tmpNotificationId != idOs) {
        notification.hasError = true;
    }
    return notification;
}

export function notificationDisplayNameExtractor(item: NotificationData) {
    return NotificationHelper.getTimeText(item.time);
}

export async function notifDeleteNotificationsByNotificationDatas(notifications: NotificationData[]) {
    if (notifications.length > 0) {
        let ids: string[] = [];
        for (let notification of notifications) {
            ids.push(notification.id);
        }
        await notifDeleteNotificationsByNotifIds(ids);
    }
}

export async function notifDeleteNotificationsByNotifIds(ids: string[]) {
    if (ids.length > 0) {
        await notifee.cancelTriggerNotifications(ids);
    }
}

export type SyncronizationResultType = {
    addedNotifications: NotificationData[]
    finalNotifications: NotificationData[];
}

export async function notifSyncronizeNotifications(workoutId: string, workoutName: string, workoutNotifications: NotificationData[]): Promise<SyncronizationResultType> {
    // LogService.infoFormat('notifSyncronizeNotifications id: {0}', workoutId);
    let addedNotifications: NotificationData[] = [];
    let finalNotifications: NotificationData[] = [];
    const t = i18n.t
    if (GenHelper.isStringNotEmpty(workoutId)) {
        const osNotifications = await notifee.getTriggerNotifications();
        const osNotificationsByid: TriggerNotification[] = osNotifications?.filter(item => NotificationHelper.checkNotificationByWorkoutId(workoutId, item));
        // let willBeAddedNotifications: NotificationData[] = [];
        let willBeDeletedOSNotifIds: string[] = [];
        // LogService.infoFormat('notifSyncronizeNotifications  osNotificationsByid number {0}', osNotificationsByid.length);
        for (let workoutNotification of workoutNotifications) {
            const currentOSNotification = osNotificationsByid.find(item => item.notification.id == workoutNotification.idOs)
            if (currentOSNotification != null) {
                if (!NotificationHelper.isWorkoutAndOSNotificationSame(workoutId, workoutName, workoutNotification, currentOSNotification)) {
                    // update notification
                    // LogService.infoFormat('notifSyncronizeNotifications updateNotification \n  workoutNotif: {0} \n osNotif:{1} \n newData  {2}', LogHelper.toString(workoutNotification), LogHelper.toString(currentOSNotification), LogHelper.toString(NotificationHelper.createNotificationDataWorkout(workoutId, workoutNotification.daysOfWeek)));
                    const messageTitle = NotificationHelper.createNotificationMessage(workoutName, workoutNotification.time, t(ResKey.NotificationTitlePrefixMessage));
                    const data = NotificationHelper.createNotificationDataWorkout(workoutId, workoutNotification.daysOfWeek);
                    const updatedNotification = await notifUpdateTriggerNotification(workoutNotification.id, workoutNotification.idOs, messageTitle, NotificationsConstants.messageBody, workoutNotification.time, data, workoutNotification.daysOfWeek);
                    finalNotifications.push(updatedNotification);
                } else {
                    // LogService.infoFormat('notifSyncronizeNotifications  dont  updateNotification \n  workoutNotif: {0} \n osNotif:{1}', LogHelper.toString(workoutNotification), LogHelper.toString(currentOSNotification));
                    finalNotifications.push(workoutNotification);
                }
            } else {
                // willBeAddedNotifications.push(workoutNotification);
                // LogService.infoFormat('notifSyncronizeNotifications AddNotifications \n workoutNotif: {0}', LogHelper.toString(workoutNotification));
                const messageTitle = NotificationHelper.createNotificationMessage(workoutName, workoutNotification.time, t(ResKey.NotificationTitlePrefixMessage));
                const data = NotificationHelper.createNotificationDataWorkout(workoutId, workoutNotification.daysOfWeek);
                const newWorkoutNotification = await notifAddTriggerNotification(workoutNotification.id, messageTitle, NotificationsConstants.messageBody, workoutNotification.time, data, workoutNotification.daysOfWeek);
                addedNotifications.push(newWorkoutNotification);
                finalNotifications.push(newWorkoutNotification);
            }
        }

        for (let osNotification of osNotificationsByid) {
            const currentNotification = workoutNotifications.find(item => item.idOs == osNotification.notification.id);
            if (currentNotification == null) {
                willBeDeletedOSNotifIds.push(osNotification.notification.id!);
            }
        }

        // delete extra osNotifs
        if (willBeDeletedOSNotifIds.length > 0) {
            // LogService.infoFormat('notifSyncronizeNotifications deleteOSNotifications  ids: {0} ', LogHelper.toString(willBeDeletedOSNotifIds));
            notifDeleteNotificationsByNotifIds(willBeDeletedOSNotifIds);
        }

        // // add missingNotifications
        // if (willBeAddedNotifications.length > 0) {
        //     for (let workoutNotification of willBeAddedNotifications) {
        //         LogService.infoFormat('notifSyncronizeNotifications AddNotifications \n  workoutNotif: {0}', LogHelper.toString(workoutNotification));
        //         const newWorkoutNotification = await notifAddTriggerNotification(workoutId, workoutNotification.message, workoutNotification.time);
        //         addedNotifications.push(newWorkoutNotification);
        //         finalNotifications.push(newWorkoutNotification);
        //     }
        // }
        // LogService.warnFormat('notifSyncronizeNotifications end \n finalNotifications: {0}', LogHelper.toString(finalNotifications));
    }
    return { addedNotifications: addedNotifications, finalNotifications: finalNotifications };
}

export async function notifClearDetachedNotifications(workoutIds: string[]): Promise<void> {
    try {
        let willBeDeletedOSNotifIds: string[] = [];
        const osNotifications = await notifee.getTriggerNotifications();

        osNotifications?.forEach(item => {
            if (!NotificationHelper.checkNotificationByWorkoutIds(workoutIds, item)) {
                willBeDeletedOSNotifIds.push(item.notification.id!);
            }
        }
        );

        if (willBeDeletedOSNotifIds.length > 0) {
            notifDeleteNotificationsByNotifIds(willBeDeletedOSNotifIds);
        }
        LogService.debugFormat('notifClearDetachedNotifications deletedOSIds: {0} workoutIds:{1}', LogHelper.toString(willBeDeletedOSNotifIds), LogHelper.toString(workoutIds));
    } catch (error) {
        logError(error);
    }
}

/**
 * must be called before app registry.
 * if it is not used notifee displays bugy behaviour when app is not alive and there is notification.
 */
export function notifRegisterBackgroundEvent() {
    notifee.onBackgroundEvent(async ({ type, detail }) => {
        const { notification, pressAction } = detail;
        // LogService.debugFormat('onBackgroundEvent detail: {0} \n type:{1}', LogHelper.toString(detail), type);
        if (type == EventType.DELIVERED) {
            notifProcessInternalNotification(notification);
        }

        // will use notifee initialNotification instead custom solution that way I can get the notification when app is alive and notification pressed
        // const notificationDetail: NotificationDetail | null = detail ? { notification: detail.notification } as NotificationDetail : null;
        // if (type === EventType.PRESS && pressAction?.id == 'default') {
        //     LogService.warnFormat('onBackgroundEvent please open some screen');
        //     setLastBackgroundNotification(notificationDetail);
        //     //   // Remove the notification
        //     //   await notifee.cancelNotification(notification.id);
        // }
    });
}

export async function notifProcessInternalNotification(notification: Notification | null | undefined) {
    if (notification != null && notification.id != null
        && notification?.android?.channelId == NotificationsConstants.channelIdInternal
        && notification?.android?.importance == AndroidImportance.NONE) {
        const notificationData = notification.data as DataTypeWorkout;
        let willDisplayNotification = false;
        if (notificationData.daysOfWeek == null || notificationData.daysOfWeek == '') {
            willDisplayNotification = true
        }
        else {
            let daysOfWeek: boolean[] = JSON.parse(notificationData.daysOfWeek);
            const todayDate = new Date(Date.now());
            const todayIndexDay = DayOfWeekHelper.getWeekDayFromDateIndex(todayDate.getDay());
            // LogService.infoFormat('notifProcessInternalNotification parsed daysOfWeek {0} todayIndexDay: {1}', LogHelper.toString(daysOfWeek), todayIndexDay);
            if (DayOfWeekHelper.isDayOfWeekActive(daysOfWeek, todayIndexDay)) {
                willDisplayNotification = true
            }
        }
        // LogService.infoFormat('notifProcessInternalNotification cancel notification: ');
        await notifee.cancelDisplayedNotification(notification.id);
        if (willDisplayNotification) {
            const channelId = await notifCreateChannelExternal();
            await notifDisplayNotification(channelId, notification.title!, notification.body!, notification.data!, AndroidImportance.HIGH);
        }
    }
}