import { IContractType } from "./contractType";
import { ILocalCompany } from "./localCompany";
import { ITime } from "./time";
import { ICurrency } from "./currency";

export interface IContract {
    id: number;
    key: string;
    startDate: Date;
    endDate: Date;
    name: string;
    description: string;
    timeId: number;
    currencyId: number;
    localCompanyId: number;
    contractStatusId: number;
    hasAmount: boolean;
    amount: number;
    contractTypeId: number;
    fileId: number;
    languageId: number;
    projectTaskId: number;
    projectId: number;
    statusRecordId: number;
    contractTypeName: string;
    localCompanyName: string;

    time?: ITime;
    currency?: ICurrency;
    localCompany?: ILocalCompany;
    contractType?: IContractType;
}