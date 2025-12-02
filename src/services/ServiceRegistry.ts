import { IService } from "./IService";

export class ServiceRegistry {
    private container: Map<string, IService> = new Map<string, IService>();

    private static instance: ServiceRegistry | null = null;

    static getInstance(): ServiceRegistry {
        if (ServiceRegistry.instance == null) {
            ServiceRegistry.instance = new ServiceRegistry();
        }
        return ServiceRegistry.instance;
    }


    addService(service: IService, id?: number): void {
        let tmpId: number = 1;
        if (id != null) {
            tmpId = id;
        }
        this.container.set(service.name + tmpId, service);
    }

    getService(serviceName: string, id?: number): IService | null {
        let result = null;
        let tmpId: number = 1;
        if (id != null) {
            tmpId = id;
        }
        let key = serviceName + tmpId;
        if (this.container.has(key)) {
            result = this.container.get(key) as IService;
        }
        return result;
    }
}