import { Audit } from "./audit";
import { IProjectState } from "./project-state";

export interface IProject extends Audit {
    id: number;
    projectTypeId: number;
    locationId: number;
    name: string;
    description: string;
    currencyId: number;
    totalBudget: number;
    initialDate: string;
    endDate: string;
    statusRecordId: number;
    currencyCode: number;
    currencyDescription: string;
    locationName: string;
    projectTaskAutorizes: [];
    projectTypeName: string;
    statusProjectId: number;
    statusProjectName: string;
    pictureUrl: any;
    artistId?: number;
    artistName: string;
    upcCode: string;
    projectState?: IProjectState[];
    venue: string;
    deposit: number;
    depositDate: string;
    lastPayment: number;
    lastPaymentDate: string;
    spent: number;
}