import type { AxiosInstance } from "axios"

const BASE_URL = '/despesas'

export default class DespesasAPI {

    private http: AxiosInstance

    constructor(http: AxiosInstance) {
        this.http = http
    }

    inserir(payload: any): Promise<any> {
        return this.http.post(`${BASE_URL}`, payload)
    }

    listagem(params: any): Promise<any> {
        return this.http.get(`${BASE_URL}`, {
            params: params
        })
    }

    compensacaoManual(payload: any, id: number): Promise<any> {
        return this.http.patch(`${BASE_URL}/${id}/compensacao/manual`, payload)
    }

}