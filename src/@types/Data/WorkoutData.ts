import { NotificationData } from "./NotificationData";
import { WorkoutComponentData } from "./WorkoutComponentData";

export type WorkoutData = {
    id: string;
    name: string;
    components: WorkoutComponentData[];
    notifications: NotificationData[];
}