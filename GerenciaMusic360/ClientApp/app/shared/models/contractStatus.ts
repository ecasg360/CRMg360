import { IStatusModule } from "./StatusModule";

export interface IContractStatus {
    id: number;
    contractId: number;
    statusId: number;
    data: Date;
    notes: string;
    userVerificationId: number;
    statusModule?: IStatusModule;
}