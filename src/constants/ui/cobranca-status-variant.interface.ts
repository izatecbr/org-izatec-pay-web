
export const CobrancaStatusVariant: any = {
    ATIVA: {
        value: 'ATIVA',
        label: 'Ativa',
        color: 'bg-blue-500 text-white',
    },
    FINALIZADA: {
        value: 'FINALIZADA',
        label: 'Finalizada',
        color: 'bg-green-500 text-white',
    },
    QUITADA: {
        value: 'QUITADA',
        label: 'Quitada',
        color: 'bg-teal-500 text-white',
    },
    ENCERRADA: {
        value: 'ENCERRADA',
        label: 'Encerrada',
        color: 'bg-gray-500 text-white',
    },
    CANCELADA: {
        value: 'CANCELADA',
        label: 'Cancelada',
        color: 'bg-red-500 text-white',
    },
} as const;

export type CobrancaStatusVariantType = keyof typeof CobrancaStatusVariant;
