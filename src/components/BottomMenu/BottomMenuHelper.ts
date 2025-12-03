import { ResKey } from "../../lang/ResKey";
import { ListInsertionPositionType } from "./ListInsertionPositionType";

export interface SelectionData {
    key: string;
    name: string;
}

export function getResKey(key: ListInsertionPositionType): string {
    let result: string = ResKey.BottomMenuDuplicateJustBelow;
    // if (key == ListInsertionPositionType.JustBelow) {
    //   result = ResKey.BottomMenuDuplicateJustBelow;
    // } else
    if (key == ListInsertionPositionType.AtEnd) {
        result = ResKey.BottomMenuDuplicateAtEnd;
    } else if (key == ListInsertionPositionType.AtStart) {
        result = ResKey.BottomMenuDuplicateAtStart;
    }

    return result;
}

export const duplicateSelectionData: SelectionData[] = Object.values(ListInsertionPositionType).map(key => {
    return { key: key, name: getResKey(key) };
});
