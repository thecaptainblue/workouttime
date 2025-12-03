import { StringBuilder } from "typescript-string-operations";
import { LogService } from "../services/Log/LogService";

// export function runFunc<Args extends unknown[], ReturnValue>(func: (...args: Args) => ReturnValue): (...args: Args) => void {
//     return function (...argsNew: Args) {
//         'worklet';
//         return func(...argsNew);
//     }
// }


// export const disMeasurement = (measurement: MeasuredDimensions | null): string => {
//     // 'worklet';
//     const text: StringBuilder = new StringBuilder();
//     if (measurement != null) {
//         text.append('height: ' + measurement.height.toFixed(2) + ', ');
//         text.append('width: ' + measurement.width.toFixed(2) + ', ');
//         text.append('pageX: ' + measurement.pageX.toFixed(2) + ', ');
//         text.append('pageY: ' + measurement.pageY.toFixed(2) + ', ');
//         text.append('x: ' + measurement.x.toFixed(2) + ', ');
//         text.append('y: ' + measurement.y.toFixed(2) + ', ');
//     } else {
//         text.append('null');
//     }
//     console.log(' text ', text.toString())
//     return text.toString();
// }

export default class LogHelper {
    // static disMeasurement(measurement: MeasuredDimensions | null): string {
    //     // 'worklet';

    //     const text: StringBuilder = new StringBuilder();
    //     if (measurement != null) {
    //         text.append('height: ' + measurement.height.toFixed(2) + ', ');
    //         text.append('width: ' + measurement.width.toFixed(2) + ', ');
    //         text.append('pageX: ' + measurement.pageX.toFixed(2) + ', ');
    //         text.append('pageY: ' + measurement.pageY.toFixed(2) + ', ');
    //         text.append('x: ' + measurement.x.toFixed(2) + ', ');
    //         text.append('y: ' + measurement.y.toFixed(2) + ', ');
    //     } else {
    //         text.append('null');
    //     }
    //     console.log(' text ', text.toString())
    //     return text.toString();
    // }

    static toString(o: any | null, name?: string, isSeparateLine?: boolean, useBuiltInToString?: boolean): string {
        return this.toStringInternal(o, name, isSeparateLine, 0, useBuiltInToString);
    }

    private static toStringInternal(o: any | null, name?: string, isSeparateLine?: boolean, indent?: number, useBuiltInToString?: boolean): string {
        // 'worklet';
        // console.info('toString ', isSeparateLine);
        const text: StringBuilder = new StringBuilder();
        let tmpIndent = indent;

        if (name != null && name !== undefined && name !== '') {
            text.append(name + '; ');
        }

        if (o != null) {
            if (typeof o === 'object' && useBuiltInToString == true && this.hasToStringMethod(o)) {
                // console.info('builtin ToStringMethod case; ', o);
                text.append(o.toString());
            }
            else if (typeof o === 'object') {
                const entries: [string, unknown][] = Object.entries(o);
                if (entries != null && entries.length > 0) {
                    entries.forEach((entry, index) => {
                        // console.info("toString entry: ", entry)
                        const key = entry[0];
                        const value = entry[1];
                        if (typeof value !== 'function') {
                            if (typeof value === 'object') {
                                text.append(key + ': { ' + LogHelper.toStringInternal(value, undefined, isSeparateLine, tmpIndent) + ' }');
                            }
                            else {
                                text.append(key + ': ' + this.toStringBasics(value));
                            }

                            if (index !== entries.length - 1) {
                                text.append(', ')
                            }
                        }
                    });

                    // text.append('height: ' + measurement.height.toFixed(2) + ', ');

                } else if (entries != null && entries.length == 0) {
                    // iteratorlar da bos dondugu icin kontrol ediliyor.
                    let index = 0;
                    let willPassAsEmpty = false;
                    if (this.isIterableIterator(o)) {
                        // console.info('its symbol');
                        // tmpIndent = this.increaseIndent(isSeparateLine, tmpIndent);
                        for (const item of o) {
                            // console.log("item ", item);
                            // this.separateLine(text, isSeparateLine, tmpIndent);
                            if (index !== 0) {
                                text.append(', ')
                            }
                            text.append(index++ + ': { ' + LogHelper.toStringInternal(item, undefined, isSeparateLine, tmpIndent) + ' }');
                        }
                    } else if (this.isMap(o)) {
                        tmpIndent = this.increaseIndent(isSeparateLine, tmpIndent);
                        for (const entry of o.entries()) {
                            // LogService.infoFormat('isseparate ', isSeparateLine);
                            // console.info('isMap case; ', o);
                            this.separateLine(text, isSeparateLine, tmpIndent);
                            text.append(`key${index}:  ` + LogHelper.toStringInternal(entry[0], undefined, isSeparateLine, tmpIndent) + ` value${index}: ` + LogHelper.toStringInternal(entry[1], undefined, isSeparateLine, tmpIndent));
                            index++;
                        }
                        // console.info('its map');
                    } else if (this.hasToStringMethod(o)) {
                        // console.info('hasToStringMethod case; ', o);
                        text.append(o.toString());
                        willPassAsEmpty = true;
                    }

                    if (index == 0 && willPassAsEmpty == false) {
                        // console.info('index==0 case; type:%s, stdout:%s, basic:%s ', typeof o, o, this.toStringBasics(o));
                        //bos arrrayler icin
                        text.append("[]");
                    }
                }
                else {
                    text.append('null');
                }
            } else if (typeof o !== 'function') {
                text.append(this.toStringBasics(o));
            } else {
                text.append('unexpected o');
            }


        } else {
            text.append('null');
        }
        // console.log(' text ', text.toString())
        return text.toString();
    }

    private static toStringBasics(value: any) {
        let text: string = '';
        if (typeof value !== 'object' && typeof value !== 'function') {

            if (typeof value === 'number' && !isNaN(value) && !Number.isInteger(value)) {
                text = (value as number).toFixed(2);
            }
            else {
                text = value;
            }
        }
        else {
            text = 'unexpected';
        }
        return text;
    }

    private static increaseIndent(isSeparateLine?: boolean, indent?: number | undefined) {
        let result = indent;
        if (isSeparateLine == true && indent != null) {
            indent += 2;
        }

        return result;
    }

    private static separateLine(text: StringBuilder, isSeparateLine?: boolean, indent?: number | undefined) {
        if (isSeparateLine == true) {
            let space = '\n';
            if (indent != null) {
                space = space.padEnd(indent, ' ');
            }
            text.append(space);
            // console.log('separate line')
            // text.appendLine('');
        }
    }

    private static isIterableIterator<T>(obj: any): obj is IterableIterator<T> {
        let result = false;
        if (typeof obj[Symbol.iterator] === 'function' && typeof obj.next === 'function') {
            result = true;
        }
        return result;
    }

    private static isMap(obj: any): obj is Map<any, any> {
        return obj instanceof Map;
    }

    private static hasToStringMethod(obj: unknown): obj is { toString: () => string } {
        return obj !== null && typeof obj === 'object' && "toString" in obj && typeof (obj as any).toString === 'function';
    }
}

export function logError(e: any, name?: string) {
    let errorMessage = '';
    let willConsolePrinted = false;

    if (e instanceof Error) {
        errorMessage = ' (Error) ' + e.message;
    } else if (typeof e === 'string') {
        errorMessage = ' (string) ' + e;
    } else if (typeof e === 'object' && e !== null) {
        errorMessage = ' (object) ' + JSON.stringify(e);
    } else {
        errorMessage = ' (String) ' + String(e);
        willConsolePrinted = true
    }

    if (name) {
        errorMessage = `${name} ${errorMessage}`;
    }

    LogService.error(errorMessage);
    if (willConsolePrinted) {
        console.log(e);
    }
}
