export interface CadastroResponse {
    id: number
    avalista: any
    empresa: number
    documento: string
    nomeCompleto: string
    email: string
    whatsapp: number
    dataNascimento: any
    endereco: any
    notificacao: NotificacaoResponse
}

export interface NotificacaoResponse {
    email: boolean
    whatsapp: boolean
}

export interface CadastroRequest {
    id?: null
    documento?: string
    nomeCompleto: string
    email: string
    whatsapp: any
    dataNascimento: string
    endereco: EnderecoRequest
    notificacao: NotificacaoRequest
}

export interface EnderecoRequest {
    cep: string
    numero: string
    logradouro: string
}

export interface NotificacaoRequest {
    email: boolean
    whatsapp: boolean
}
