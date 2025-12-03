import { Keyboard } from "react-native";
import { KeyValuePair } from "../@types/KeyValuePair";
import { EnumBase } from "../EnumBase";
import { LogService } from "../services/Log/LogService";
import LogHelper, { logError } from "./LogHelper";

export function dismisKeyboard() {
    Keyboard.dismiss();
}


export class GenHelper {
    static isStringNotEmpty(text: string | null | undefined) {
        let result = false;
        if (text != null && text != undefined && text != '') {
            result = true;
        }
        return result;
    }

    static isSimpleDeepEqual(param1: any, param2: any) {
        let result = false;
        if ((param1 === null && param2 === null) || (param1 === undefined && param2 == undefined)) {
            result = true;
        }
        else if (typeof param1 !== 'object' && typeof param2 !== 'object' && param1 === param2) {
            result = true;
        }
        else if (typeof param1 === 'object' && typeof param2 === 'object') {

            const keysObj1 = Object.keys(param1);
            const keysObj2 = Object.keys(param2);
            if (keysObj1.length == keysObj2.length) {
                result = true;
                try {
                    for (const key of keysObj1) {
                        if (!this.isSimpleDeepEqual(param1[key], param2[key])) {
                            result = false;
                            break;
                        }
                    }
                } catch (error) {
                    logError(error, 'isSimpleDeepEqual');
                    result = false;
                }
            }
        }
        return result;
    }

    /**
     * only tested for arrays, literal objects and primitive types!!
     * @param obj 
     * @returns 
     */
    static SimpleDeepCopy(obj: any): any {
        let result;
        if (obj != null && typeof obj === 'object') {
            type objType = typeof obj;
            if (Array.isArray(obj)) {
                let newObj: objType = [];
                let index = 0;
                for (let objValue of obj) {
                    // LogService.infoFormat('deepCopy key {0}', LogHelper.toString(entry[0]));
                    // console.log('deepCopy array value {0}', objValue);
                    newObj[index] = this.SimpleDeepCopy(objValue);
                    index++;
                }
                result = newObj;
            } else if (obj instanceof Date) {
                // Handle Date objects
                // todo test
                result = new Date(obj.getTime());
            } else {
                let newObj: objType = {};
                const entries = Object.entries(obj);
                if (entries.length == 0) {
                    // LogService.infoFormat('entries.length=0 {0}', LogHelper.toString(obj))
                    console.log('entries.length=0 %s', obj)
                } else {
                    for (let entry of entries) {
                        // LogService.infoFormat('deepCopy key {0}', LogHelper.toString(entry[0]));
                        // console.log('deepCopy key {0}', entry[0]);
                        newObj[entry[0]] = this.SimpleDeepCopy(entry[1]);
                    }
                    // LogService.infoFormat('deepCopy object loop {0}', LogHelper.toString(newObj));
                    // console.log('deepCopy object loop %s', newObj);
                }
                result = newObj;
            }
        } else {
            result = obj;
        }
        return result;
    }

    // referans icin tutuyorum
    private static deepCopyAnother<T>(obj: T): T {
        if (obj === null || typeof obj !== "object") {
            // Handle primitive types (string, number, boolean, null, undefined)
            return obj;
        }

        if (Array.isArray(obj)) {
            // Handle arrays
            return obj.map(item => this.deepCopyAnother(item)) as unknown as T;
        }

        if (obj instanceof Date) {
            // Handle Date objects
            return new Date(obj.getTime()) as unknown as T;
        }

        if (obj instanceof Map) {
            // Handle Map objects
            return new Map(
                Array.from(obj.entries()).map(([key, val]) => [this.deepCopyAnother(key), this.deepCopyAnother(val)])
            ) as unknown as T;
        }

        if (obj instanceof Set) {
            // Handle Set objects
            return new Set(Array.from(obj).map(item => this.deepCopyAnother(item))) as unknown as T;
        }

        // Handle plain objects
        const copy = {} as Record<string, unknown>;
        for (const key in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, key)) {
                copy[key] = this.deepCopyAnother((obj as Record<string, unknown>)[key]);
            }
        }

        return copy as T;
    }

    //enum string string oldugunda key value cifti beklenildigi gibi cikarken , 
    // enum string, number oldugunda bir den key 2nci sirada olan number oluyor value ise string 
    static getKeyValuePair<T>(enumType: EnumBase<T>): KeyValuePair<string, T>[] {
        let result: KeyValuePair<string, T>[] = [];

        // LogService.infoFormat('entries {0}', LogHelper.toString(Object.entries(enumType)))

        Object.entries(enumType).forEach(item => {
            result.push({ key: item[0], value: item[1] });
            // LogService.infoFormat(`key: ${item[0]} value: ${item[1]}`)
        })
        return result;
    }

    static getKeyFromEnumObj<T extends EnumBase<K>, K>(enumType: T, value: K): string | undefined {
        const result: string | undefined = Object.entries(enumType).find(item => item[1] == value)?.[0]
        return result;
    }

    static parseEnumFromKey<T extends EnumBase<K>, K>(key: K, enumType: T) {
        const result = enumType[key as keyof T];
        return result;
    }

    // casting works no need
    // static getEnumObjectByValue<T extends EnumBase<K>, K>(enumType: T, value: K): { key: keyof T; value: T[keyof T] } | undefined {
    //     const key = Object.keys(enumType).find((k) => enumType[k as keyof T] === value);
    //     if (key) {
    //         return {
    //             key: key as keyof T,
    //             value: enumType[key as keyof T],
    //         };
    //     }
    //     return undefined; // Return undefined if no matching enum object is found
    // }

}