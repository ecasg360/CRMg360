import { Audit } from "./audit";

export interface IProjectTravelLogisticsHotel extends Audit {
    id: number;
    projectTravelLogisticsId: number;
    name: string;
    addressId: number;
    roomNumber: string;
    reservationName: string;
    totalCost: number;
    statusRecordId: number;
    isInternal: number;
}