export interface PagamentoRequest {
    codigoIdentificacao: string
    codigoExteno: string
    parcela: number
    valor: number
    mensagem: string
    vencimento: VencimentoRequest
    sacado: SacadoRequest
}

export interface VencimentoRequest {
    data: string
    hora: string
}

export interface SacadoRequest {
    documento: string
    nomeCompleto: string
}
