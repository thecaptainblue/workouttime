import { NotificationData } from "./NotificationData";
import { WorkoutComponentData } from "./WorkoutComponentData";
import { WorkoutComponentType } from "./WorkoutComponentType";
import { WorkoutData } from "./WorkoutData";
import { WorkoutTimeData } from "./WorkoutTimeData";

export class WorkoutHelper {
    static createExerciseRepBased(id: string, name: string, description: string, lap: number, duration: WorkoutTimeData, reps: number): WorkoutComponentData {
        let result: WorkoutComponentData = { componentType: WorkoutComponentType.ExerciseRepBased, id: id, name: name, description: description, isRest: null, lap: lap, duration: duration, reps: reps, childeren: null };
        return result;
    }

    static createExerciseTimeBased(id: string, name: string, description: string, isRest: boolean, lap: number, duration: WorkoutTimeData): WorkoutComponentData {
        let result: WorkoutComponentData = { componentType: WorkoutComponentType.ExerciseTimeBased, id: id, name: name, description: description, isRest: isRest, lap: lap, duration: duration, reps: null, childeren: null };
        return result;
    }

    static createGroupOnlyId(id: string,): WorkoutComponentData {
        return WorkoutHelper.createGroup(id, '', '', 1, []);
    }

    static createGroup(id: string, name: string, description: string, lap: number, childeren?: WorkoutComponentData[] | null): WorkoutComponentData {
        let result: WorkoutComponentData = { componentType: WorkoutComponentType.Group, id: id, name: name, description: description, isRest: null, lap: lap, duration: null, reps: null, childeren: childeren != null ? childeren : [] };
        return result;
    }

    static createWorkout(id: string, name: string, items?: WorkoutComponentData[], notifications?: NotificationData[]): WorkoutData {
        return { id: id, name: name, components: items != null ? items : [], notifications: notifications != null ? notifications : [] };
    }

    static createWorkoutDistinct(workout: WorkoutData, workouts: WorkoutData[] | null, idCreater: () => string): WorkoutData {
        let workoutId = workout.id;
        let workoutName = workout.name;
        if (workouts != null) {
            const idIndex = workouts.findIndex(item => item.id == workoutId || item.name == workoutName);
            if (idIndex >= 0) {
                workoutId = idCreater();
            }
            workoutName = this.checkAndGenerateWorkoutName(workoutName, workouts);
        }
        const newWorkout = this.createWorkout(workoutId, workoutName, workout.components);
        return newWorkout;
    }

    //todo :optimization; tektek sormak yerine tek seferde halledilebilir.
    private static checkAndGenerateWorkoutName(workoutName: string, workouts: WorkoutData[]): string {
        let resultWorkoutName = workoutName;
        // if (workouts != null) {
        let willContinue = true;
        while (willContinue) {
            const tmpWorkout = workouts.find(item => item.name == resultWorkoutName);
            if (tmpWorkout != null) {
                const lastIndexOf = resultWorkoutName.lastIndexOf('_');
                let nameEndIndex = resultWorkoutName.length;
                let postFix = 2;
                if (lastIndexOf >= 0) {
                    try {
                        const tmpNumber = Number(resultWorkoutName.substring(lastIndexOf + 1));
                        if (tmpNumber >= 0) {
                            postFix = tmpNumber + 1;
                            nameEndIndex = lastIndexOf;
                        }
                    } catch (error) { }
                }
                resultWorkoutName = resultWorkoutName.substring(0, nameEndIndex) + '_' + postFix;
            } else {
                willContinue = false;
            }
        }
        // }
        return resultWorkoutName;
    }


    // static createWorkoutLegacy(id: string, name: string, items?: WorkoutComponentData[], notifications?: NotificationData[]) {
    //     return { id: id, name: name, components: items != null ? items : [] };
    // }

    static copy(component: WorkoutComponentData, id: string, duration?: WorkoutTimeData): WorkoutComponentData {
        return { ...component, id: id, duration: duration != null ? duration : component.duration };
    }

    static addComponentToWorkout(workout: WorkoutData, component: WorkoutComponentData): void {
        if (component != null) {
            if (workout.components == null) {
                workout.components = [];
            }
            workout.components.push(component);
        }
    }

    static addComponentsToWorkout(workout: WorkoutData, components: WorkoutComponentData[]): void {
        if (components != null && components.length >= 0) {
            if (workout.components == null) {
                workout.components = [];
            }
            workout.components.push(...components);
        }
    }

    static isSingleWorkoutComponent(component: WorkoutComponentData): boolean {
        let result: boolean = false;
        if (component.componentType !== WorkoutComponentType.Group) {
            result = true
        }
        return result;
    }

    static addComponentToGroup(group: WorkoutComponentData, component: WorkoutComponentData): void {
        if (group.componentType === WorkoutComponentType.Group) {
            if (group.childeren == null) {
                group.childeren = [];
            }
            group.childeren.push(component);
        }
    }

    static addComponentsToGroup(group: WorkoutComponentData, components: WorkoutComponentData[]): void {
        if (components != null && components.length > 0) {
            if (group.componentType === WorkoutComponentType.Group) {
                if (group.childeren == null) {
                    group.childeren = [];
                }
                group.childeren.push(...components);
            }
        }
    }

    static removeComponentFromGroup(group: WorkoutComponentData, componentId: string): void {
        if (group.componentType === WorkoutComponentType.Group && group.childeren != null) {

            const foundIndex = group.childeren.findIndex((item) => { item.id === componentId });
            if (foundIndex >= 0) {
                group.childeren.splice(foundIndex, 1);
            }
        }
    }

    static findComponentsWithIdLadder(components: WorkoutComponentData[] | null, idLadder: string[] | null): WorkoutComponentData[] | null {
        let result: WorkoutComponentData[] | null = components;
        if (idLadder != null) {
            let tmpComponent: WorkoutComponentData | undefined | null;
            for (let i = 0; i < idLadder.length; i++) {
                const tmpId = idLadder[i];
                if (result != null) {
                    tmpComponent = result.find(item => item.id === tmpId);
                    if (tmpComponent != null) {
                        result = tmpComponent.childeren;
                    }
                    else {
                        result = null;
                        break;
                    }
                }
                else {
                    break;
                }
            }
        }
        return result;
    }

    static findComponentWithIdLadderAndId(components: WorkoutComponentData[] | null, idLadder: string[] | null, componentId: string): WorkoutComponentData | null {
        let result: WorkoutComponentData | null = null;
        const tmpComponents: WorkoutComponentData[] | null = WorkoutHelper.findComponentsWithIdLadder(components, idLadder);
        if (tmpComponents != null) {
            const tmpComponent = tmpComponents.find(item => item.id === componentId);
            if (tmpComponent != null) {
                result = tmpComponent;
            }
        }
        return result;
    }

    static findNotificationById(notifications: NotificationData[] | null, notificationId: string): NotificationData | null {
        let result: NotificationData | null = null;
        if (notifications != null) {
            const tmpComponent = notifications.find(item => item.id === notificationId);
            if (tmpComponent != null) {
                result = tmpComponent;
            }
        }
        return result;
    }

    static cleanDuplicateIds(components: WorkoutComponentData[]): WorkoutComponentData[] {
        let result: WorkoutComponentData[];
        let ids: string[] = [];
        if (components != null && components.length > 0) {
            result = components.filter(item => {
                if (!ids.includes(item.id)) {
                    ids.push(item.id);
                    return true;
                } else {
                    return false;
                }
            })
        } else {
            result = components;
        }
        return result;
    }
}