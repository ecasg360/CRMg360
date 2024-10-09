import { IPerson } from "./person";
import { Work } from "./work";
import { IComposerDetail } from "./composer-detail";
import { IAssociation } from "./association";

export interface IWorkCollaborator {
    id: number;
    workId: number;
    composerId: number;
    associationId: number;
    amountRevenue: number;
    percentageRevenue: number;
    composer?: IPerson;
    composerDetail?: IComposerDetail;
    association: IAssociation;
    work?: Work;
    isCollaborator: boolean;
}