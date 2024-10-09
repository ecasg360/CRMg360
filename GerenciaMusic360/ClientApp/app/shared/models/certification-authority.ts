import { IAddress } from './address';
export interface CertificationAuthority {
    id: number;
    name: string;
    businessName: string;
    phone: string;
    contact: string;
    addressId: number;
    statusRecordId: number;
    address: IAddress;
}