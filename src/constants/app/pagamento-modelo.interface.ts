export const PagamentoModelo = {
    // UNICO: {
    //     value: 'UNICO',
    //     label: 'Único',
    // },
    RECORRENTE: {
        value: 'RECORRENTE',
        label: 'Recorrente',
    },
    PARCELADO: {
        value: 'PARCELADO',
        label: 'Parcelado',
    },
    // PROGRAMADO: {
    //     value: 'PROGRAMADO',
    //     label: 'Programado',
    // },
}

export type PagamentoModeloType = keyof typeof PagamentoModelo;