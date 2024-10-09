import { ITerms } from "./terms";

export interface IContractTerms {
    id: number;
    contractId: number;
    termId: number;
    position: number;

    term?: ITerms;
}

export interface IContractTermType {
    id: number;
    termTypeId: number;
    contractId: number;
    termTypeName: string;
}