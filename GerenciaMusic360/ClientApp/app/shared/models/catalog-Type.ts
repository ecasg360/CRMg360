import { Audit } from './audit';
export interface CatalogType extends Audit {
    id: number,
    typeId: number;
    name: string;
    description: string;    
    statusRecordId: boolean;
}