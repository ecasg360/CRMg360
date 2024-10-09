import { ITermType } from "./termType";

export interface ITerms {
    id: number;
    termTypeId: number;
    name: string;

    termType?: ITermType;
    select: boolean
}