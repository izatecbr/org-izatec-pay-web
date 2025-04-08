export const TipoNotificacao = {
    WHATSAPP: {
        value: 'WHATSAPP',
        label: 'Whatsapp',
    },
    EMAIL: {
        value: 'EMAIL',
        label: 'Email',
    },

}

export type TipoNotificacaoType = keyof typeof TipoNotificacao;