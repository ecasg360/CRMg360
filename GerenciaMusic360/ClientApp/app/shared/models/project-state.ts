import { IStatusProject } from "./status-project";
import { IUser } from "./user";
import { Audit } from "./audit";

export interface IProjectState extends Audit {
    id: number;
    statusProjectId: number;
    date: string;
    notes: string;
    statusRecordId: number;
    approverUserId: number;
    statusProject?: IStatusProject;
    userProfile: IUser;
}