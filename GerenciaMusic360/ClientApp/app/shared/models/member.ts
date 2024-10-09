import { IPerson } from './person';
import { IAddress } from './address';
export interface IMember extends IPerson {
    biography: string;
    personRelationId?: number;
    mainActivityId: number;
    mainActivity: string;
    startDateJoinedString: string;
    endDateJoinedString: string;
    musicalsInstruments: number[];
    addressList: IAddress[];
    aliasName: string;
}