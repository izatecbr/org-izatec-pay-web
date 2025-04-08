import type { AxiosInstance } from "axios"

const BASE_URL = '/acessos'

export default class AcessoAPI {
    private http: AxiosInstance
    constructor(http: AxiosInstance) {
        this.http = http
    }

    integracao(payload: AcessoPayload): Promise<any> {
        return this.http.post(`${BASE_URL}/integracao`, payload)
    }

    empresa(payload: AcessoEmpresaPayload): Promise<any> {
        return this.http.post(`${BASE_URL}/empresa`, payload)
    }
}