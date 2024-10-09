export interface IConfigurationImage {
    id: number;
    configurationId: number;
    pictureUrl: string;
    statusRecordId: number;
    isDefault: boolean;
    name: string;
}

export interface IConfigurationImageCss extends IConfigurationImage {
    cssClass: string;
}