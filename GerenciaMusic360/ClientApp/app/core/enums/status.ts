export enum EProjectStatusName {
    started = '#006064',
    waiting = '#f9a825',
    inProgress = '#1e88e5',
    completed = '#388e3c',
    canceled = '#d32f2f',
    default = '#1e90ff',
    all = '#1e2129'
}

const ProjectStatusId = ['#006064', '#f9a825', '#1e88e5', '#388e3c', '#d32f2f', '#1e90ff', '#1e2129'];
export { ProjectStatusId };

export enum EMarketingStatus {
    'active' = '#81c784',
    'inactive' = '#ffb74d',
    'Cancelled' = '#e57373',
    'finalized' = '#4fc3f7',
}

export enum EContractStatus {
    'Created' = '#4dd0e1',
    'Send' = '#e6ee9c',
    'ReceivedbyGM360' = '#fff59d',
    'SignedbyGM360' = '#4db6ac',
    'Cancelled' = '#e57373',
}