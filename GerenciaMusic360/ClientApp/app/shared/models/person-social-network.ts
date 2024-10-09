import { MainActivity } from "./main-activity";

export interface IPersonSocialNetwork {
    id: number;
    personId: number;
    link: string;
    statusRecordId: number;
    socialNetworkTypeId: number;
    socialNetWork?: MainActivity[];
}
