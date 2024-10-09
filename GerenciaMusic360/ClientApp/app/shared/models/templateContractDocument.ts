import { ITemplateContractDocumentMarker } from "./templateContractDocumentMarker";

export interface ITemplateContractDocument {
    id: number;
    documentName: string;

    templateContractDocumentMarker?: ITemplateContractDocumentMarker[]
}