import { Work } from '@models/work';
export interface Album {
    id: number;
    name: string;
    personId: number;
    personRelationId: number;
    numRecord: string;
    statusRecordId: number;
    releaseDateString: string;
    releaseDate: string;
    pictureUrl: string;
    works: Work[];
    personRelationName: string;
}