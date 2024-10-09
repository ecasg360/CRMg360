export interface IAddress {
    id?: number;
    addressTypeId: number;
    addressType: string;
    personId: number;
    countryId: number;
    country: string;
    stateId: number;
    state: string;
    cityId: number;
    city: string;
    municipality: string;
    neighborhood: string;
    street: string;
    exteriorNumber: string;
    interiorNumber: string;
    postalCode: string;
    reference: string;
    statusRecordId: number;
    addressLine1?: string;
    addressLine2?: string;
}