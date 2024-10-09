import { IContractTerms } from "./contractTerms";

export interface ITermType {
    id: number;
    name: string;
    contractTerms?: IContractTerms[];
}

export interface IContractTermType {
    id: number;
    termTypeId: number;
    contractId: number;
    termTypeName: string;
}