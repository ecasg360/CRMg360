import { IForeignWorkPerson } from "./foreignWorkPerson";

export interface IForeignWork {
    id: number;
    name: string;
    foreignWorkPerson?: IForeignWorkPerson[];
}