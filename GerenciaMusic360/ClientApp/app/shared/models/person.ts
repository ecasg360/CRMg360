import { IComposerDetail } from "./composer-detail";

export interface IPerson {
    id: number;
    name: string;
    lastName: string;
    secondLastName: string;
    birthDateString: string;
    birthDate: string;
    gender: string;
    email: string;
    officePhone: string;
    cellPhone: string;
    pictureUrl: string;
    personTypeId: number;
    personType: string;
    isInternal: boolean;    
    composerDetail: IComposerDetail;
}
