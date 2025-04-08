export const BadgeVariant: any = {
    SOLICITADO: {
        value: 'SOLICITADO',
        label: 'Solicitado',
        color: 'bg-blue-500 text-white',
    },
    PENDENTE: {
        value: 'PENDENTE',
        label: 'Pendente',
        color: 'bg-yellow-500 text-black',
    },
    INTEGRADO: {
        value: 'INTEGRADO',
        label: 'Integrado',
        color: 'bg-green-500 text-white',
    },
    GERADO: {
        value: 'GERADO',
        label: 'Gerado',
        color: 'bg-green-500 text-white',
    },
    COMPENSADO: {
        value: 'COMPENSADO',
        label: 'Compensado',
        color: 'bg-teal-500 text-white',
    },
    EXPIRADO: {
        value: 'EXPIRADO',
        label: 'Expirado',
        color: 'bg-red-500 text-white',
    },
    CANCELADO: {
        value: 'CANCELADO',
        label: 'Cancelado',
        color: 'bg-gray-500 text-white',
    },
} as const;

export type BadgeVariantType = keyof typeof BadgeVariant;
