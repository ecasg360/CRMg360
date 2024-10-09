import { Audit } from './audit';
export interface SocialNetworkType extends Audit {
    id: number,
    name: string;
    description: string;
    pictureUrl: string;
    statusRecordId: number;
}

export interface SocialNetworkTypeWithCss extends SocialNetworkType {
    cssClass: string;
}