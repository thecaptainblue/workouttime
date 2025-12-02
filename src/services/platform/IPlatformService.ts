import { IService } from "../IService";

export interface IPlatformService extends IService {

    getLangualeLocale(): string | null | undefined;

}