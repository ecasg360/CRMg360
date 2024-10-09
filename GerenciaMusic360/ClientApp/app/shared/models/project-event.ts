export interface IProjectEvent {
    id: number;
    projectId: number;
    eventDate: Date;
    venue: string;
    locationId: number;
    deposit: number;
    depositDate: Date;
    lastPayment: number;
    lastPaymentDate: Date;
    guarantee: number;
    statusRecordId: string;
    locationName: string
}