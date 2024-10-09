import { IPerson } from "./person";

export interface IWorkRecording {
    id: number;
    workId: number;
    artistId: number;
    recordingDate?: Date;
    rating?: number;
    amountRevenue?: number;
    notes?: string;
    detail?: IPerson;
    isEdit?: boolean;
    idEdit?: number;
}