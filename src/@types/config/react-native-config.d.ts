declare module 'react-native-config' {

    //use uppercase and string values for all entries.

    interface NativeConfig {
        CONFIGTYPE?: string;
        ISDEBUG?: string;
        ADUNITID: string;
    }

    // dont use this config directly instead use in Config.ts file 
    // dont change this name because library finds by name
    // dont try to create another const and convert boolean strings into string here because if field name is same library will inject into too.
    const Config: NativeConfig
    export default BaseConfig = Config;

}