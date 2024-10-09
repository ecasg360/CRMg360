import { IPerson } from './person';
export interface IArtist extends IPerson {
    biography: string;
    price: number;
    webSite: string;
    artistTypeId: number;
    artistType: string;
    musicalGenre: string;
    generalTaste: string;
    aliasName: string;
    personRelationId: number;
    pathPicture: string;
    pictureUrl: string;
    statusRecordId: number;
}

export interface IProjectArtist {
    id: number;
    projectId: number;
    guestArtistId: number;
}