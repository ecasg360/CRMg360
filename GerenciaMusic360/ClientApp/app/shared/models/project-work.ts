import { IWorkCollaborator } from "./work-collaborator";
import { IProjectWorkAdmin } from "./projectWorkAdmin";
import { IWorkRecording } from "./work-recording";
import { Work } from "./work";
import { IPerson } from "./person";

export interface IProjectWork {
    id: number;
    projectId: number;
    albumId: number;
    itemId: number;
    productionTypeId: number;
    isInternal: boolean;
    albumName: string;
    itemName: string;
    productionTypeName: string;
    isrc?: string;
    personProducerId?: number;
    isComposerInternal?: boolean;
    personComposerId?: number;
    editorId?: number;
    associationId?: number;
    personRemixId?: number;

    personRemixName?: string;
    personProducerName?: string;
    
    workRelatedId?: number;
    foreignWorkRelatedId?: number;
    isInternalRelated?: number;

    select?: boolean;
    percentageRevenueTotal?:number;
    percentageRevenueLeft?:number;
    workCollaborators?: IWorkCollaborator[];

    percentageAdminTotal?:number;
    percentageAdminLeft?:number;
    projectWorkAdmin?: IProjectWorkAdmin[];

    editoras?: any[];
    trackId?: number;
    workId?: number;
    amountRevenue?: number;
    trackName?: string;
    trackWorkId?: number;
    trackWorkISRC?: string;
    numberTrack?: number;
    trackTime?: string;
    trackWorkUPC?: string;
    trackReleaseDate?: Date;
    trackSoundRecordingRegistration?: Date;
    trackMusicCopyright?: Date;
    trackSoundExchangeRegistration?: Date;
    trackWorkForHireSound?: Date;
    trackWorkForHireVideo?: Date;

    workRecordings?: IWorkRecording[];
    work: Work;
    MixMaster: IPerson;
    Producer: IPerson;

    composersList?: string;
    publishersList?: string;
    personPublisherId?: number;
}