export interface CobrancaResponse {
    id?: number
    empresa?: number
    configuracao?: ConfiguracaoResponse
    titulo?: string
    descricao?: string
    observacao?: any
    endereco?: string
    pagamento?: PagamentoResponse
    quantidadeParcelas?: number
    sacado?: SacadoResponse
    status?: string
    dataGeracao?: DataGeracaoResponse
    valorCobranca?: number
    valorCobrado?: number
    codigoExterno?: string
}

export interface ConfiguracaoResponse {
    cnpj?: string
    nomeFantasia?: string
}

export interface PagamentoResponse {
    diaVencimento?: number
    proximoVencimento?: string
    proximaParcela?: number
    modelo?: string
    recorrencia?: string
}

export interface SacadoResponse {
    id?: number
    documento?: string
    nomeCompleto?: string
}

export interface DataGeracaoResponse {
    dia?: string
    hora?: string
    dataHora?: string
}
