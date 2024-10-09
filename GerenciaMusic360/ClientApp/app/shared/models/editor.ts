import { IAssociation } from "./association";

export interface IEditor {
    id: number;
    dba: string;
    name: string;
    localCompanyId: number;
    associationId: number;
    isInternal: boolean;

    association?: IAssociation;
}