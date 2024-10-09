export interface IMenu {
    id: number;
    title: string;
    translate: string;
    type: string;
    icon: string;
    url: string;
    parentId: number;
    menuOrder: number;
    statusRecordId: number;
    children: IMenu[];
}