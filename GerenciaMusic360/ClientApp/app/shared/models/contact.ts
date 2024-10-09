import { IPerson } from './person';
export interface IContact extends IPerson {
    typeId: number;
    projectId?: number;
}