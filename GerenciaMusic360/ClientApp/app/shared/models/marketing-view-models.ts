export interface IPlaylistStreamingTable {
  socialNetworkId: number;
  socialNetworkName: string;
  playlistId: number;
  playlistName: string;
}

export interface IMarketingOverviews {
  id: number;
  marketingId: number;
  sectionId: number;
  descriptionExt: string;
  position: number;
}

export interface IMarketingOverviewDetail {
  id: number;
  marketingOverviewId: number;
  socialNetworkTypeId: number;
  playListId: number;
  mediaId: number;
  materialId: number;
  position: number;
}