export interface ResponseApi<T> {
    code: number;
    message: string;
    result: T;
}