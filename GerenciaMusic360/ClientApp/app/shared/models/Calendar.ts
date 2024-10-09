export interface Calendar {
    id: number;
    title: string;
    startDate: string;
    endDate: string;
    startDateString: string;
    endDateString: string;
    allDay: number;
    pictureUrl: any;
    checked: number;
    location: string;
    notes: string;
    statusRecordId: number;
    personId: number;
    projectTaskId: number;
    projectTaskIsMember: boolean;
    userName: string;
    artistName: string;
    isProjectRelease: boolean;
}