import { IAssociation } from "./association";
import { IEditor } from "./editor";

export interface IComposerDetail {
    id: number;
    associationId: number;
    editorId: number;
    composerId: number;
    ipi: string;
    dateStart?: string;
    dateEnd?: string;
    association?: IAssociation;    
    editor?: IEditor;

}
