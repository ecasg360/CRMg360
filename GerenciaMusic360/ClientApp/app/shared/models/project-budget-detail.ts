import { ICategory } from "./category";

export interface ProjectBudgetDetail {
    id: number;
    projectBudgetId: number;
    categoryId: number;
    spent: number;
    dateString: string;
    notes: string;
    category: ICategory;
}