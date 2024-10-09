export interface IPlaylistStreamingTable {
  socialNetworkId: number;
  socialNetworkName: string;
  playlistId: number;
  playlistName: string;
}

export interface IConfigurationMarketingOverviewSection {
  id: number;
  configurationId: number;
  sectionId: number;
  position: number;
  active: boolean;
}

export interface IMarketingOverview {
  id: number;
  marketingId: number;
  sectionId: number;
  descriptionExt: string;
  position: number;
}

export interface IMarketingOverViewDetail {
  id: number;
  marketingOverviewId: number;
  socialNetworkTypeId: number;
  playListId: number;
  mediaId: number;
  materialId: number;
  position: number;
  name: string;
  pictureUrl: string;
  socialNetwork: string;
}


export interface IMarketingMediaTarget {
  id: number;
  name: string;
  pictureUrl: string;
}

export interface IMarketingSocial {
  overviewId: number;
  socialName: string;
  socialId: number;
  pictureUrl: string;
}

export interface IMarketingOverviewStreaming extends IMarketingSocial {
  overview: IMarketingOverview;
  detail: IMarketingOverViewDetail[];
}