import type { SacadoStateValue } from "../../types";

export const SacadoState: { [value: string]: SacadoStateValue } = {
    EMPTY: 'EMPTY',
    EXIST: 'EXIST',
    NOT_EXIST: 'NOT_EXIST'
}

export type SacadoStateType = keyof typeof SacadoState;