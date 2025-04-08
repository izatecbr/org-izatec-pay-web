
// Despesa
export interface DespesaRequest {
    valor: number
    titulo: string
    favorecido: FavorecidoRequest
    negociacao: NegociacaoRequest
}

export interface FavorecidoRequest {
    documento: string
    nomeCompleto: string
}

export interface NegociacaoRequest {
    modelo: string
    recorrencia: string
    proximoVencimento: string
}



// Despesa de Pagemento
export interface DespesaPagamentoRequest {
    parcela: number
    valor: number
    mensagem: string
    vencimento: VencimentoPagamentoRequest
    favorecido: FavorecidoPagamentoRequest
}

export interface VencimentoPagamentoRequest {
    data: string
    hora: string
}

export interface FavorecidoPagamentoRequest {
    documento: string
    nomeCompleto: string
}


// Despesa Diária
export interface DespesaDiariaRequest {
    valor: number
    titulo: string
    favorecido: FavorecidoDiariaRequest
    negociacao: NegociacaoDiariaRequest
}

export interface FavorecidoDiariaRequest {
    nomeCompleto: string
}

export interface NegociacaoDiariaRequest {
    modelo: string
    recorrencia: string
    proximoVencimento: string
}
