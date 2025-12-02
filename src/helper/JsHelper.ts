import { IMeta } from "../@types/IMeta";
import { MetaTypes } from "../@types/MetaTypes";
import { EscapedMetaTypeKey, MetaTypeConverter, MetaTypeKey, MetaTypeStructure } from "./json/MetaTypeConverter";




export class JsHelper {

    static replacer(key: string, value: any) {
        if (typeof value === "object" && value !== null) {
            if (value instanceof Map) {
                let metaInfo: MetaTypeStructure = { type: MetaTypes.Map, payload: Array.from(value.entries()) };
                return {
                    _metaType: metaInfo,
                };
            } else if (value instanceof Set) {
                let metaInfo: MetaTypeStructure = { type: MetaTypes.Set, payload: Array.from(value.values()) };
                return {
                    _metaType: metaInfo,
                };
            } else if (MetaTypeConverter.instanceOfMeta(value)) {
                // console.log('replacer _metaType ', value)
                let metaInfo: MetaTypeStructure = { type: value._metaType };
                return {
                    ...value,
                    _metaType: metaInfo,
                }
            }
            else if (MetaTypeKey in value) {
                // Escape "_metaType" properties
                let metaInfo: MetaTypeStructure = { type: EscapedMetaTypeKey, payload: value[MetaTypeKey] };
                return {
                    ...value,
                    _metaType: metaInfo,
                };
            }
        }
        return value;
    }

    static reviver(key: string, value: any) {
        if (typeof value === "object" && value !== null) {
            if (MetaTypeKey in value) {
                return MetaTypeConverter.Convert(value);
            }
        }
        return value;
    }

    static stringify(value: any): string {
        return JSON.stringify(value, this.replacer);
    }

    static parse(text: string): any {
        return JSON.parse(text, this.reviver);
    }
}