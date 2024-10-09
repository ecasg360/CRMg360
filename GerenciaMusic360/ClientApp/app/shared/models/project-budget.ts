import { ICategory } from './category';
import { ProjectBudgetDetail } from './project-budget-detail';
export interface ProjectBudget {
    id: number;
    projectId: number;
    categoryId: number;
    categoryName: string;
    budget: number;
    spent: number;
    notes: string;
    projectBudgetDetail: ProjectBudgetDetail[];
    category: ICategory;
    statusRecordId: number;
}

export interface ProjectBudgetExtend extends ProjectBudget {
    saldo: number;
}