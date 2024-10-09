import { UserTask } from './user-task';
export interface ProjectTask {
    completed: boolean;
    estimatedDateVerfication: string;
    estimatedDateVerficationString: any;
    id: number;
    notes: string;
    position: number;
    projectId: number;
    required: boolean;
    templateTaskDocumentDetailId: number;
    templateTaskDocumentDetailName: string;
    templateTaskDocumentId: number;
    templateTaskDocumentName: string;
    users: UserTask[];
    selectedUsers: UserTask[];
    isNew: boolean;
    checked: boolean;
    comments: boolean;
    hasContractPending: number;
}

export interface ProjectTaskDetail extends ProjectTask {
    year: any;
    day: any;
    weekDay: any;
    month: any;
}
