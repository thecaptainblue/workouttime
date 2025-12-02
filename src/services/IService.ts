export interface IService {
    name: string;
    initialize(): void;
    finalize(): void;
}