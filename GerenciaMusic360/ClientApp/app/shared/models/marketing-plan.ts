export interface IMarketingPlan {
    id: number;
    marketingId: number;
    taskDocumentDetailId: number;
    position: number;
    notes: string;
    estimatedDateVerification: string;
    required: boolean;
    status: boolean;
    name: string;
    estimatedDateVerificationString: string;
    comments: boolean;
    complete: boolean;
}

export interface IMarketingPlanAutorizes {
    marketingPlanId:  number;
    userVerificationId:  number;
    verificationDate:string;
    checked: boolean;
    verificationDateString: string;
    notes: string;
}