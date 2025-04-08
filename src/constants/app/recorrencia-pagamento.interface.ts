export const RecorrenciaPagamento = {
    // UNICA: {
    //     dias: 1,
    //     value: 'UNICA',
    //     label: 'Única'
    // },
    
    MENSAL: {
        dias: 30,
        value: 'MENSAL',
        label: 'Mensal'
    },
    SEMANAL: {
        dias: 7,
        value: 'SEMANAL',
        label: 'Semanal'
    },
    DIARIA: {
        dias: 1,
        value: 'DIARIA',
        label: 'Diária'
    },
    // QUINDIAL: {
    //     dias: 5,
    //     value: 'QUINDIAL',
    //     label: 'Quinzenal'
    // },

    // SEMESTRAL: {
    //     dias: 180,
    //     value: 'SEMESTRAL',
    //     label: 'Semestral'
    // },
    // ANUAL: {
    //     dias: 365,
    //     value: 'ANUAL',
    //     label: 'Anual'
    // }
}

export type RecorrenciaPagamentoType = keyof typeof RecorrenciaPagamento;