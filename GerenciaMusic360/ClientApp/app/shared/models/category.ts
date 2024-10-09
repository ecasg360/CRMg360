import { IModule } from "./module";

export interface ICategory {
    id: number;
    name: string;
    description: string;
    pictureUrl: string;
    key: string;
    moduleId: number
    module?: IModule,
    projectTypeId: number,
}