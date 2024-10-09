import { Audit } from './audit';
export interface MusicalInstrument extends Audit {
    id: number,
    name: string;
    pictureUrl: string;
    statusRecordId: boolean;
}