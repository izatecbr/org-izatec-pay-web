import type { AxiosInstance } from "axios"

const BASE_URL = '/cobrancas'

export default class CobrancaAPI {

    private http: AxiosInstance

    constructor(http: AxiosInstance) {
        this.http = http
    }

    listagem(params: any): Promise<any> {
        return this.http.get(`${BASE_URL}`, {
            params: params
        })
    }

    pagamentos(id: number): Promise<any> {
        return this.http.get(`${BASE_URL}/${id}/pagamentos`)
    }

    inserir(payload: any): Promise<any> {
        return this.http.post(`${BASE_URL}`, payload)
    }


}