export interface CepResponse {
    cep: string
    logradouro: string
    bairro: string
    complemento: string
    localidade: string
    estado: string
    uf: string
    ibge: number
    gmt: any
    regiao: string
    valido: boolean
}
