export interface IBudgetEvent {
    id: number;
    eventDate: string;
    deposit: number;
    lastPayment: number;
    depositDate: string;
    lastPaymentDate: string;
    totalBudget: number;
    venue: string;
    location: string;
    selected: boolean;
}