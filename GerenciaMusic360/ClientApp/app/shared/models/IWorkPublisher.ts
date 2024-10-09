import { IPublisher } from "./Publisher";
import { Work } from "./work";
import { IAssociation } from "./association";

export interface IWorkPublisher {
    id: number;
    workId: number;
    publisherId: number;
    associationId: number;
    amountRevenue: number;
    percentageRevenue: number;
    publisher?: IPublisher;
    association?: IAssociation;
    work?: Work;
}