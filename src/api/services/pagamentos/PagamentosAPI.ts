import type { AxiosInstance } from "axios"
import type { AppResponse } from "../../../types"

const BASE_URL = '/pagamentos'

export default class PagamentosAPI {
    private http: AxiosInstance
    constructor(http: AxiosInstance) {
        this.http = http
    }

    listagem(params: any): Promise<any> {
        return this.http.get(`${BASE_URL}`, {
            params: params
        })
    }

    compensacaoManual(payload: any, id: number): Promise<any> {
        return this.http.patch(`${BASE_URL}/${id}/compensacao/manual`, payload)
    }

    quitacaoManual(payload: any, id: number): Promise<any> {
        return this.http.patch(`${BASE_URL}/${id}/quitacao/manual`, payload)
    }

    qrcode(codigo: any): Promise<any> {
        return this.http.get(`${BASE_URL}/${codigo}/imagem/qrcode`, { responseType: 'arraybuffer' })
    }

    inserir(payload: any): Promise<any> {
        return this.http.post(`${BASE_URL}`, payload)
    }

    gerarIntegracao(payload: any, id: number): Promise<AppResponse<any>> {
        return this.http.patch(`${BASE_URL}/${id}/integracao`, payload)
    }
}