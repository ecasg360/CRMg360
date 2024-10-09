import { IContractType } from "./contractType";

export interface IConfigurationProjectTaskContract {
    id: number;
    projectTypeId: number;
    contractTypeId: number;
    taskDocumentDetailId: number;
    required: number;
    configurationId: number;
    contractType: IContractType;
}