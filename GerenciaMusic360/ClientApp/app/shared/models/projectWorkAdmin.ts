import { IEditor } from "./editor";

export interface IProjectWorkAdmin {
    id: number;
    projectWorkId: number;
    workId: number;
    editorId: number;
    percentage: number;

    editor?: IEditor;
}