import BaseConfig from "react-native-config"

const ConfigConstants = {
    true: 'true',
    false: 'false'
}

export interface ConfigWt {
    configType?: string;
    isDebug: boolean;
    adUnitId: string;
}

// turn boolean string values more usable boolean variables
// leave other string values as it is
const Config: ConfigWt = {
    configType: BaseConfig.CONFIGTYPE,
    isDebug: BaseConfig.ISDEBUG == ConfigConstants.true,
    adUnitId: BaseConfig.ADUNITID,
    // ISDEBUG: false,
}

export default Config