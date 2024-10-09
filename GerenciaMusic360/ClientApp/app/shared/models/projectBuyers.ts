import { IPerson } from "./person";
import { BuyerType } from "./buyerType";
import { ICompany } from "./company";

export interface IProjectBuyers {
    id: number;
    projectId: number;
    personId: number;
    companyId: number;
    buyerType: number;

    person: IPerson;
    buyer: BuyerType;
    company: ICompany;
}