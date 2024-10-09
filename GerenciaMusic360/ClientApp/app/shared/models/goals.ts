export interface IMarketingGoals {
  id: number;
  marketingId: number
  goalId: number
  overcome: boolean;
  userVerificationId: number;
  audited: boolean;
  goalQuantity: number;
  currentQuantity: number;
  socialNetworkTypeId: number;
  goal: any;
  goalName: string;
  pictureURL: string;
  socialNetworkName: string;
}

export interface IGoals {
  id: number;
  name: string;
  active: boolean;
}

export interface IMarketingGoalsAudited {
  id: number;
  marketingId: number;
  socialNetworkTypeId: number;
  date: string;
  quantity: number;
  userVerificationId: number;
  dateString: string;
  socialNetworkName: string;
  pictureURL: string;
  artistPictureURL: string;
  variation: number;
}