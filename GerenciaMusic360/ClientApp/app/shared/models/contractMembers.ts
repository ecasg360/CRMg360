import { IPerson } from "./person";
import { ILocalCompany } from "./localCompany";
import { IContractRole } from "./contractRole";

export interface IContractMembers {
    id: number;
    contractId: number;
    personId: number;
    companyId: number;
    contractRoleId: number;

    person?: IPerson;
    company?: ILocalCompany;
    contractRole?: IContractRole;
}



