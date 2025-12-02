import { createMMKV } from "react-native-mmkv";
import { IService } from "../IService";
import { ServiceBase } from "../ServiceBase";

export class FSService extends ServiceBase implements IService {
    static BaseName = 'FSService';
    name: string = FSService.BaseName;
    private storage = createMMKV();

    initialize(): void {
    }
    finalize(): void {
    }

    save(name: string, value: string) {
        // console.log('fsService save :', name, value);
        this.storage.set(name, value);
    }

    get(name: string): string | undefined {
        let result = this.storage.getString(name);
        // console.log('fsService get:', result);
        return result;
    }

    hasKey(name: string): boolean {
        let result = false;
        if (this.storage.contains(name)) {
            result = true;
        }
        return result;
    }

    deleteEntry(name: string): void {
        this.storage.remove(name);
    }

}