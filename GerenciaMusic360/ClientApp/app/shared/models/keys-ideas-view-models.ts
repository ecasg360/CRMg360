export interface IConfigurationKeysIdeas {
  categoryId: number;
  configurationId: number;
  id: number;
  keyIdeasTypeId: number;
  position: number;
}

export interface IMarketingKeyIdeas {
  id: number;
  categoryId: number;
  marketingId: number;
  keyIdeasTypeId: number;
}

export interface IKeysIdeas {
  id: number;
  keyIdeasTypeId: number;
  categoryId: number;
  socialNetworkTypeId: number;
  name: string;
  position: number;
  pictureUrl: string;
  socialNetwork: string;
  marketingKeyIdeasNameId: number;
}

export interface IKeysIdeasWithBudget extends IKeysIdeas {
  budget: IMarketingKeyIdeasBudget[];
}

export interface IKeysIdeasCss extends IKeysIdeas {
  cssClass: string;
}

export interface IMarketingKeyIdeasBudget {
  id: number;
  marketingKeyIdeasId: number;
  target: string;
  percentageBudget: number;
  socialNetworkId: number;
}

export interface IMarketingKeyIdeasNames {
  id: number;
  marketingKeyIdeasId: number;
  keyIdeasId: number;
}

export interface IPlatformData {
  objetive: string;
  percentage: number;
  social_network: number;
  social_network_name: string;
}