import { IWorkCollaborator } from "./work-collaborator";

export interface ITrack {
    id: number;
    workId: number;
    projectId: number;
    name: string;
    numberTrack?: number;
    time?: string;
    releaseDate?: string;
    soundRecordingRegistration?: string;
    musicCopyright?: string;
    soundExchangeRegistration?: string;
    workForHireSound?: string;
    workForHireVideo?: string;
    statusRecordId?: number;
    isrc?: string;
}