export type AppResponse<T> = {
    body: T | null | T[] |  any,
    status: any;
    success: boolean;
}  

export type FormMode = 'new' | 'edit' | 'view';

export type SacadoStateValue = 'EMPTY' | 'EXIST' | 'NOT_EXIST'