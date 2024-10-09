import { Audit } from './audit';
export interface MainActivity extends Audit {
    id: number,
    name: string;
    description: string;
    pictureUrl: string;
    statusRecordId: boolean;
}