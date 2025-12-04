import { WorkoutPointer } from './WorkoutPointer';
import { WorkoutComponentInfo } from './WorkoutComponentInfo';
import { LogService } from '../../services/Log/LogService';
import { WorkoutData } from '../../@types/Data/WorkoutData';
import { WorkoutHelper } from '../../@types/Data/WorkoutHelper';
import { ParentInfo } from './ParentInfo';


export class WorkoutTraverser {
    workout: WorkoutData;
    pointers: WorkoutPointer[] = [];

    constructor(workout: WorkoutData) {
        this.workout = workout;
        this.pointers.push(new WorkoutPointer(null, workout.components, -1, 1, 1, null));
    }

    next(): WorkoutComponentInfo | null {
        // LogService.debug('WorkoutTraverser.next called');
        let result: WorkoutComponentInfo | null = null;
        if (!this.isPointerEmpty() && !this.isTraverseForwardCompleted()) {
            this.traverseForward();
            if (!this.isTraverseForwardCompleted()) {
                const { components, index, lapSingle } = this.peekPointers();
                const parentInfos = this.getParentInfo();
                result = new WorkoutComponentInfo(components[index], lapSingle!, parentInfos);
            }
        }
        return result;
    }

    isTraverseForwardCompleted(): boolean {
        let result: boolean = false;
        const topLevelPointer: WorkoutPointer = this.pointers[0];
        if (topLevelPointer.index >= topLevelPointer.components.length) {
            result = true;
        }
        return result;
    }

    lastIndexOfPointers(): number {
        let result = -1;
        if (this.pointers != null && this.pointers.length > 0) {
            result = this.pointers.length - 1;
        }

        return result;
    }

    peekPointers(): WorkoutPointer {
        return this.pointers[this.pointers.length - 1];
    }

    isPointerEmpty(): boolean {
        let result: boolean = false;
        if (this.pointers == null || this.pointers.length == 0 || this.pointers[0].components == null || this.pointers[0].components.length == 0) {
            result = true;
        }
        return result;
    }

    getParentInfo(): ParentInfo[] {
        let result: ParentInfo[] = [];
        for (let pointer of this.pointers) {
            if (pointer.parentId != null) {
                result.push({ id: pointer.parentId, lap: pointer.lapGroup, targetLap: pointer.lapTargetGroup });
            }
        }

        return result
    }

    // //todo: recursive function'i normale cevirir loop ile yap.
    // traverseForward() {
    //     const { components, index } = this.peekPointers();
    //     let nextIndex = index + 1;
    //     if (nextIndex < components.length) {
    //         let currentComponent = components[nextIndex];
    //         if (currentComponent.isSingleWorkout()) {
    //             this.pointers[this.lastIndexOfPointers()].index = nextIndex;
    //         } else {
    //             //update current index
    //             this.pointers[this.lastIndexOfPointers()].index = nextIndex;
    //             if (currentComponent.childeren != null && currentComponent.childeren.length > 0) {
    //                 // add childerens as new pointer and call findNextComponent again
    //                 this.pointers.push(new WorkoutPointer(currentComponent.childeren!, - 1));
    //             }
    //             this.traverseForward();
    //         }
    //     }
    //     else {
    //         //this list is finished remove from list
    //         if (this.pointers.length > 1) {
    //             this.pointers.pop();
    //             this.traverseForward();
    //         }
    //         else {
    //             if (this.pointers.length === nextIndex) {
    //                 // end of traverse, update index
    //                 this.pointers[this.lastIndexOfPointers()].index = nextIndex;
    //             }
    //         }
    //     }
    // }

    traverseForward() {
        // LogService.debug("traverseForward: ");
        while (!this.isTraverseForwardCompleted()) {
            const { components, index, lapGroup: lapGroup, lapSingle } = this.peekPointers();

            //single lap
            if (index >= 0) {
                let currentComponent = components[index];
                // console.log(' name', currentComponent.)
                if (WorkoutHelper.isSingleWorkoutComponent(currentComponent) && lapSingle != null && lapSingle > 1) {
                    // LogService.debug("decrement lapSingle: ", lapSingle - 1);
                    //decrement lapSingle 
                    this.pointers[this.lastIndexOfPointers()].lapSingle = lapSingle - 1;
                    break;
                }
            }

            let nextIndex = index + 1;
            // LogService.debug("nextIndex: ", nextIndex);
            if (nextIndex < components.length) {
                let nextComponent = components[nextIndex];
                // LogService.debug("nextComponent: ", nextComponent);
                if (WorkoutHelper.isSingleWorkoutComponent(nextComponent)) {
                    this.pointers[this.lastIndexOfPointers()].index = nextIndex;
                    this.pointers[this.lastIndexOfPointers()].lapSingle = nextComponent.lap;
                    break;
                } else {
                    //update current index
                    this.pointers[this.lastIndexOfPointers()].index = nextIndex;
                    if (nextComponent.childeren != null && nextComponent.childeren.length > 0) {
                        // add childerens as new pointer and call findNextComponent again
                        //todo: parentId bilgisini burada ekleyebilirim. nextComponentid parentId olarak su anki pointerdaki parentId ustune eklenip(yeni
                        // bir array olarak workoutPointer icerisine eklenecek bu sekilde her seviyede ustteki bilgilere erisebilecek)
                        // lap bilgiside pointerden alinabilir sanirim buna tekrar bakacagim.
                        this.pointers.push(new WorkoutPointer(nextComponent.id, nextComponent.childeren, - 1, nextComponent.lap, nextComponent.lap, null));
                    }
                }
            }
            else {

                if (lapGroup > 1) {
                    // LogService.debug("decrement lapGroup: ", lapGroup - 1);
                    //decrement lapGroup and  reset other pointer properties
                    this.pointers[this.lastIndexOfPointers()].index = -1;
                    this.pointers[this.lastIndexOfPointers()].lapGroup = lapGroup - 1;
                    this.pointers[this.lastIndexOfPointers()].lapSingle = null;
                }
                else {
                    //this list is finished remove from list
                    if (this.pointers.length > 1) {
                        // LogService.debug("pop pointer: ");
                        this.pointers.pop();
                    }
                    else {
                        if (this.pointers.length === 1 &&
                            this.pointers[this.lastIndexOfPointers()].components.length === nextIndex) {
                            // LogService.debug("end of traverse, update index");
                            // end of traverse, update index
                            this.pointers[this.lastIndexOfPointers()].index = nextIndex;
                        }
                        // LogService.debug("finito");
                        break;
                    }
                }
            }
        }
    }

    previous(): WorkoutComponentInfo | null {
        // LogService.debug('WorkoutTraverser.next called');
        let result: WorkoutComponentInfo | null = null;
        if (!this.isPointerEmpty() && !this.isTraverseBackwardCompleted()) {
            this.traverseBackward();
            if (!this.isTraverseBackwardCompleted()) {
                const { components, index, lapSingle } = this.peekPointers();
                const parentInfos = this.getParentInfo();
                result = new WorkoutComponentInfo(components[index], lapSingle!, parentInfos);
            }
        }
        return result;
    }

    isAtStart(): boolean {
        return this.isAtStartPoint(0);
    }

    private isAtStartPoint(pointerIndex: number): boolean {
        let result: boolean = false;
        if (!this.isPointerEmpty()) {
            const topLevelPointer: WorkoutPointer = this.pointers[pointerIndex];
            if (topLevelPointer != null && topLevelPointer.index <= 0) {
                const firstComponent = topLevelPointer.components[0];
                if (WorkoutHelper.isSingleWorkoutComponent(firstComponent) && firstComponent.lap == topLevelPointer.lapSingle) {
                    result = true;
                } else {
                    result = this.isAtStartPoint(++pointerIndex);
                }
            }
            LogService.debugFormat('isAtStart: result {0}', result);
        }
        return result;
    }

    isAtEnd(): boolean {
        return this.isAtEndPoint(0);
    }

    private isAtEndPoint(pointerIndex: number): boolean {
        let result: boolean = false;
        if (!this.isPointerEmpty()) {
            const topLevelPointer: WorkoutPointer = this.pointers[pointerIndex];
            if (topLevelPointer != null && topLevelPointer.index >= topLevelPointer.components.length - 1) {
                const lastComponent = topLevelPointer.components[topLevelPointer.components.length - 1];
                if (WorkoutHelper.isSingleWorkoutComponent(lastComponent) && lastComponent.lap <= 1) {
                    result = true;
                } else {
                    result = this.isAtEndPoint(++pointerIndex);
                }
            }
            LogService.debugFormat('isAtEnd: result {0}', result);
        }
        return result;
    }

    isTraverseBackwardCompleted(): boolean {
        // return this.isAtStart();
        let result: boolean = false;
        const topLevelPointer: WorkoutPointer = this.pointers[0];
        if (topLevelPointer.index < 0) {
            result = true;
        }
        return result;
    }

    traverseBackward() {
        // LogService.debug("traverseForward: ");
        while (!this.isTraverseBackwardCompleted()) {
            const { components, index, lapGroup, lapTargetGroup, lapSingle } = this.peekPointers();

            //single lap
            if (index >= 0 && index < components.length) {
                let currentComponent = components[index];
                // console.log(' name', currentComponent.)
                if (WorkoutHelper.isSingleWorkoutComponent(currentComponent) && lapSingle != null && lapSingle < currentComponent.lap) {
                    // LogService.debug("decrement lapSingle: ", lapSingle - 1);
                    //decrement lapSingle 
                    this.pointers[this.lastIndexOfPointers()].lapSingle = lapSingle + 1;
                    break;
                }
            }

            let previousIndex = index - 1;
            // LogService.debug("nextIndex: ", nextIndex);
            if (previousIndex >= 0 && previousIndex < components.length) {
                let previousComponent = components[previousIndex];
                // LogService.debug("nextComponent: ", nextComponent);
                if (WorkoutHelper.isSingleWorkoutComponent(previousComponent)) {
                    this.pointers[this.lastIndexOfPointers()].index = previousIndex;
                    this.pointers[this.lastIndexOfPointers()].lapSingle = 1; //nextComponent.lap;
                    break;
                } else {
                    //update current index
                    this.pointers[this.lastIndexOfPointers()].index = previousIndex;
                    if (previousComponent.childeren != null && previousComponent.childeren.length > 0) {
                        // add childerens as new pointer and call findNextComponent again
                        this.pointers.push(new WorkoutPointer(previousComponent.id, previousComponent.childeren, previousComponent.childeren.length, 1, previousComponent.lap, null));
                    }
                }
            }
            else {
                if (this.pointers[this.lastIndexOfPointers()].lapGroup < lapTargetGroup) {
                    // LogService.debug("decrement lapGroup: ", lapGroup - 1);
                    //decrement lapGroup and  reset other pointer properties
                    this.pointers[this.lastIndexOfPointers()].index = this.pointers[this.lastIndexOfPointers()].components.length;
                    this.pointers[this.lastIndexOfPointers()].lapGroup = lapGroup + 1;
                    this.pointers[this.lastIndexOfPointers()].lapSingle = null;
                }
                else {
                    //this list is finished remove from list
                    if (this.pointers.length > 1) {
                        // LogService.debug("pop pointer: ");
                        this.pointers.pop();
                    }
                    else {
                        if (this.pointers.length === 1 &&
                            -1 === previousIndex) {
                            // LogService.debug("end of traverse, update index");
                            // end of traverse, update index
                            this.pointers[this.lastIndexOfPointers()].index = previousIndex;
                        }
                        // LogService.debug("finito");
                        break;
                    }
                }
            }
        }
    }

}