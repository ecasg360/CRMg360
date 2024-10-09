import { IPerson } from "./person";

export interface IForeignWorkPerson {
    id: number;
    foreignWorkId: number;
    personId: number;
    person?: IPerson
}