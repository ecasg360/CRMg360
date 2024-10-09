import { Audit } from "./audit";

export interface IProjectTravelLogisticsOther extends Audit {
    id: number;
    projectTravelLogisticsId: number;
    otherTypeId: number;
    name: string;
    totalCost: number;
    statusRecordId: number;
    isInternal: number;
}