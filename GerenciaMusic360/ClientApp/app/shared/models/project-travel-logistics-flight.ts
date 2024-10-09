import { Audit } from "./audit";

export interface IProjectTravelLogisticsFlight extends Audit {
    id: number;
    projectTravelLogisticsId: number;
    airLineId: number;
    airLineName: string;
    flightNumber: string;
    passengerName: string;
    passengerSeat: number;
    arrivalDate: string;
    arrivalCity: string;
    departureDate: string;
    departureCity: string;
    totalCost: number;
    statusRecordId: number;
    isInternal: number;
}