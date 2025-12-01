import { WorkoutTimeData } from "./WorkoutTimeData";


export type NotificationData = {
    id: string;
    idOs: string;
    title: string;
    message: string;
    time: WorkoutTimeData;
    daysOfWeek?: boolean[] | null;
    hasError?: boolean;
}