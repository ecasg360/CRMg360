export interface IFile {
    id: number;
    fileName: string;
    path: string;
    moduleId: number;
    rowId: number;
    hash: string;
    statusRecordId: number;
    fileURL: string;
    fileExtention: string;
}