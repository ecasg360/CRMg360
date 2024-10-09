import { IPerson } from '@models/person';
export interface IPersonProject extends IPerson {
    ProjectTypeId: number;
    ProjectContacts: any[];
}