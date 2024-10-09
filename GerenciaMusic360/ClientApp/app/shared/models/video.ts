import { IArtist } from "./artist";

export interface IVideo {
    id: number;
    name: string;
    pictureUrl: string;
    cover: boolean;
    videoTypeId: number;
    videoUrl: string;
    statusRecordId: number;
    videoTypeName: string;
    artists: IArtist[];
}
