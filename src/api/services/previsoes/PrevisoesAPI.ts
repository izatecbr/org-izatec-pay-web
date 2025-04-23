import type { AxiosInstance } from "axios"
import type { AppResponse } from "../../../types"
import type { DespesaDiariaRequest, DespesaPagamentoRequest, DespesaRequest } from "./index.interface"

const BASE_URL = '/previsoes'

export default class PrevisoesAPI {

    private http: AxiosInstance

    constructor(http: AxiosInstance) {
        this.http = http
    }

    listagem(params: any): Promise<any> {
        return this.http.get(`${BASE_URL}`, {
            params: params
        })
    }

    listagemPagamentos(params: any): Promise<any> {
        return this.http.get(`${BASE_URL}/pagamentos`, {
            params: params
        })
    }

    inserir(payload: DespesaRequest | DespesaDiariaRequest): Promise<any> {
        return this.http.post(`${BASE_URL}`, payload)
    }

    listarDespesas(id: number): Promise<AppResponse<any>>{
        return this.http.get(`${BASE_URL}/${id}/despesas`)
    }

    inserirPagamento(payload: DespesaPagamentoRequest): Promise<any> {
        return this.http.post(`${BASE_URL}/pagamentos`, payload)
    }

    buscarPagamento(id: any): Promise<any> {
        return this.http.get(`${BASE_URL}/${id}/pagamentos`)
    }

    statusPagamento(id: any): Promise<any> {
        return this.http.get(`${BASE_URL}/pagamentos/${id}/status`)
    }



}