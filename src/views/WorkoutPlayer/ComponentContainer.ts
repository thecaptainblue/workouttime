import { LogService } from "../../services/Log/LogService";

export type ContainerRecord = {
    id: string;
    workDurationInMilliseconds: number;
    restDurationInMilliseconds: number;
    lapCompleted: number;
    lapSkipped: number;
    subrecords: ContainerSubRecord[];
}

export type ContainerSubRecord = {
    workDurationInMilliseconds: number;
    restDurationInMilliseconds: number;
}

export type ComponentContainerInfo = {
    totalWorkDurationInMilliseconds: number;
    totalRestDurationInMilliseconds: number;
    records: Map<string, ContainerRecord>;
}

export class ComponentContainer {

    private records: Map<string, ContainerRecord> = new Map<string, ContainerRecord>();
    private totalWorkDurationInMilliseconds: number = 0;
    private totalRestDurationInMilliseconds: number = 0;

    clear() {
        this.totalWorkDurationInMilliseconds = 0;
        this.totalRestDurationInMilliseconds = 0;
        this.records.clear();
    }

    getInfo(): ComponentContainerInfo {
        // LogService.infoFormat('getInfo totalRestDurationInMilliseconds:{0}', this.totalRestDurationInMilliseconds)
        return { totalWorkDurationInMilliseconds: this.totalWorkDurationInMilliseconds, totalRestDurationInMilliseconds: this.totalRestDurationInMilliseconds, records: this.records, } satisfies ComponentContainerInfo;
    }

    addRecord(id: string, workDurationInMilliseconds: number, restDurationInMilliseconds: number, lapCompleted: number, lapSkipped: number) {
        this.totalWorkDurationInMilliseconds += workDurationInMilliseconds;
        this.totalRestDurationInMilliseconds += restDurationInMilliseconds;
        const subrecord: ContainerSubRecord = { workDurationInMilliseconds: workDurationInMilliseconds, restDurationInMilliseconds: restDurationInMilliseconds };
        if (!this.records.has(id)) {
            this.records.set(id, { id: id, workDurationInMilliseconds: workDurationInMilliseconds, restDurationInMilliseconds: restDurationInMilliseconds, lapCompleted: lapCompleted, lapSkipped: lapSkipped, subrecords: [subrecord] } satisfies ContainerRecord);
        } else {
            let record = this.records.get(id)!;
            record.workDurationInMilliseconds += workDurationInMilliseconds;
            record.restDurationInMilliseconds += restDurationInMilliseconds;
            record.lapCompleted += lapCompleted;
            record.lapSkipped += lapSkipped;
            record.subrecords.push(subrecord);
        }
    }
}