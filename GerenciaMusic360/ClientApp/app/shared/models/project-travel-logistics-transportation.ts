import { Audit } from "./audit";

export interface IProjectTravelLogisticsTransportation extends Audit {
    id: number;
    projectTravelLogisticsId: number;
    ownVehicle: boolean;
    autoBrandId: number;
    vehicleName: string;
    agency: string;
    totalCost: number;
    statusRecordId: number;
    isInternal: number;
}