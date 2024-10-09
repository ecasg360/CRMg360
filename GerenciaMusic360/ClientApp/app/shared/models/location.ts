import { IAddress } from "./address";

export interface ILocation {
    id: number;
    addressId: number;
    capacity: number;
    webSite: string;
    statusRecordId: number;
    pictureUrl: string;

    Address?: IAddress;
}