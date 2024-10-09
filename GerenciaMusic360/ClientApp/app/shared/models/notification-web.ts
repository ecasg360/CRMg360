export interface INotificationWeb {
    id: number;
    message: string;
    active: boolean;
    userId?: number;
    created: string;
    creator: string;
    taskId?: number;
}