import { Audit } from "./audit";

export interface IProjectTravelLogistics extends Audit {
    id: number;
    projectId: number;
    travelLogisticsTypeId: number;
    categoryId: number;
    flightNumber: string;
    position: number;
    totalCost: number;
    isInternal: number;
    statusRecordId: number;
    projectBudgetDetailId: number;
}

export interface TravelLogisticBudget {
    fatherId: number;
    id: number;
    key: ""
    module: string;
    moduleId: number;
    name: string;
    pictureUrl: string;
    projectBudget: []
    projectBudgetDetail: []
    projectTypeId: number;
    statusRecordId: number;
}