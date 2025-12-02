
import { logger, configLoggerType, mapConsoleTransport, consoleTransport, transportFunctionType } from "react-native-logs";
import { String } from "typescript-string-operations";


export class LogService {

    private static spaceLevel: number = 0; //default 2

    private static stringifyFuncCustom = (msg: any): string => {
        let stringMsg = "";
        if (typeof msg === "string") {
            stringMsg = msg + " ";
        } else if (typeof msg === "function") {
            stringMsg = "[function] ";
        } else if (msg && msg.stack && msg.message) {
            stringMsg = msg.message + " ";
        } else {
            try {
                stringMsg = "\n" + JSON.stringify(msg, undefined, LogService.spaceLevel) + "\n";
            } catch (error) {
                stringMsg += "Undefined Message";
            }
        }
        return stringMsg;
    };

    private static defaultConfig: configLoggerType<typeof consoleTransport, "debug" | "info" | "warn" | "error"> = {
        severity: __DEV__ ? 'debug' : 'info',
        transport: consoleTransport,
        transportOptions: {
            colors: {
                info: "blueBright",
                warn: "yellowBright",
                error: "redBright",
            },
        },
        stringifyFunc: LogService.stringifyFuncCustom,
    };

    static log = logger.createLogger(LogService.defaultConfig);

    static disable() {
        this.log.disable();
    }

    static enable() {
        this.log.enable();
    }

    static debug(message?: string, ...optionalParams: unknown[]) {
        LogService.log.debug(message, ...optionalParams);
    }
    static debugFormat(message: string, ...params: unknown[]) {
        LogService.log.debug(String.format(message, ...params));
    }

    static error(message?: string, ...optionalParams: unknown[]) {
        LogService.log.error(message, ...optionalParams);
    }

    static info(message?: string, ...optionalParams: unknown[]) {
        LogService.log.info(message, ...optionalParams);
    }

    static infoFormat(message: string, ...params: unknown[]) {
        LogService.log.info(String.format(message, ...params));
    }

    static warn(message?: string, ...optionalParams: unknown[]) {
        LogService.log.warn(message, ...optionalParams);
    }

    static warnFormat(message: string, ...params: unknown[]) {
        LogService.log.warn(String.format(message, ...params));
    }

}

