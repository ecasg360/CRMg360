import { IWorkCollaborator } from "./work-collaborator";
import { IWorkPublisher } from "./IWorkPublisher";

export interface Work {
    id: number;
    name: string;
    description: string;
    createdDateString?: string;
    pictureUrl?: string;
    registeredWork?: boolean;
    registerNum?: string;
    registerDateString?: string;
    certifiedWork?: boolean;
    certificationAuthorityId?: number;
    licenseNum?: string;
    personRelationId?: number;
    albumId?: number;
    amountRevenue?: number;
    musicalGenreId?: number;
    rating?: number;
    registerDate?: string;
    revenueTypeId?: number;
    statusRecordId?: number;
    statusId?:number;

    select?: boolean;
    composerId?: number;
    isExternal?: boolean;
    workCollaborator?: IWorkCollaborator[];
    workPublisher?: IWorkPublisher[];
    musicalGenre?: string;
    songId: string;
    aka: string;
    adminPercentage: number;
    musicCopyrightDate: string;
    copyrightNum: string;
    coedition: string;
    territoryControlled: string;
    agreementDate: Date,
    ldvRelease?: boolean;
}