import { IWorkCollaborator } from "./work-collaborator";

export interface ITrackWork {
    id: number;
    trackId: number;
    isrc?: string;
    upc?: string;
    
}