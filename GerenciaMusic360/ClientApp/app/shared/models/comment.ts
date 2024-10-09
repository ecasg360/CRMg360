export interface IComment {
    id: number;
    commentary: string;
    transmitterId: number;
    requestSourceId: number;
    moduleId: number;
    taskId: number;
    users: number[];
}

export interface ICommentExtend extends IComment {
    statusModuleId: number;
    created: string;
    creator: string;
    modified: string;
    modifier: string;
    userName: string;
    userId: string;
    pictureUrl: string;
    replyActive: boolean;
    replyList: any[];
}