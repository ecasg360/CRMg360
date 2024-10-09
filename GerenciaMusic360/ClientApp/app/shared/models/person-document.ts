export interface PersonDocument {
    id: number;
    personId: number;
    personDocumentTypeId: number;
    documentType: string;
    countryId: number;
    country: string;
    number: string;
    expiredDateString: string;
    expiredDate: string;
    emisionDateString: string;
    emisionDate: string;
    statusRecordId: number;
    legalName: string;
}