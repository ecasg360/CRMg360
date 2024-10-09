export interface IMarketing {
    id: number;
    name: string;
    generalInformation: string;
    startDateString: string;
    endDateString: string;
    descriptionKeyIdeas: string;
    descriptionHeaderPlan: string;
    fileId: number;
    PictureUrl: string;
    descriptionHeaderOverviewMaterial: string;
    projectId: number;
    statusId: number;
    created: string;
    startDate: string;
    endDate: string;
    artistName: string;
    artistPictureUrl: string;
}

export interface IMarketingDates {
    year: any;
    day: any;
    weekDay: any;
    month: any;
}